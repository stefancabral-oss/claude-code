// Endpoint de IA da Setfree — substitui o window.claude.complete (que só existe no
// preview do Claude Design) por uma chamada real à API da Claude, com a chave no
// servidor (nunca no HTML). Sem dependências: usa http + fetch nativos do Node 22.
//
// Rotas:  POST /api/assistente { pergunta }  → { texto }
//         GET  /api/health                    → { ok: true }
import http from "node:http";

const PORT = process.env.PORT || 8787;
const API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5"; // rápido e barato p/ atendimento
const ALLOW = process.env.CORS_ORIGIN || ""; // ex.: https://setfree.com.br (vazio = mesma origem)

const SYSTEM = `Você é o assistente comercial da Setfree, importadora e distribuidora de tecnologia médica no Brasil.
Linhas do portfólio:
- Micro Knifes GEISTER — microcirurgia: micro lâminas de precisão (oftálmica, neuro, plástica, odontologia).
- Radimed — dor crônica: cânulas e agulhas de radiofrequência, infiltração facetária.
- Marrow Cellution — aspiração de medula óssea, coleta de células-tronco, terapias regenerativas.
- CoreBone — enxerto ósseo bioativo de origem coral, regeneração óssea.
- Lipsus — bolsa de umedecimento labial, cuidado pós-cirúrgico ao paciente.
- Dentsply Sirona (OSSIX) — regeneração óssea e tecidual guiada, odontologia.
- Parceiros Estratégicos — linha hospitalar do dia a dia, venda direta e licitações.

Registros ANVISA (cite SOMENTE estes números; nunca invente outro):
- Geister: lâminas 81888839001; cabos 81888800006 / 81888800007 / 81888800008.
- Radimed: cânula Thermo 81888830001; introdutores 81888830002 e 81888830003.
- Marrow Cellution: 81888839002.
- Lipsus: 81888830005.
- Dentsply/OSSIX: Plus 80745400045, Volumax 80745400046, Bone 80745400047.
- CoreBone: em processo de registro na ANVISA (ainda SEM número) — informe que está em processo; nunca dê número.

NUNCA fale de preço, margem ou valor de proposta. Responda em português do Brasil, no máximo 70 palavras, tom profissional e caloroso: indique a(s) linha(s) mais adequada(s) e por quê. Se nada se aplicar, diga honestamente e sugira falar com o time. NUNCA invente produtos, registros ou especificações. A indicação final é sempre confirmada por um especialista humano — deixe isso claro quando fizer sentido.`;

function send(res, code, obj, origin) {
  res.writeHead(code, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": ALLOW || origin || "*",
    "access-control-allow-headers": "content-type",
    "access-control-allow-methods": "POST, GET, OPTIONS",
  });
  res.end(JSON.stringify(obj));
}

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin;
  if (req.method === "OPTIONS") return send(res, 204, {}, origin);
  if (req.method === "GET" && req.url === "/api/health") return send(res, 200, { ok: true, model: MODEL }, origin);

  if (req.method === "POST" && req.url === "/api/assistente") {
    if (!API_KEY) return send(res, 500, { erro: "ANTHROPIC_API_KEY não configurada" }, origin);
    let body = "";
    req.on("data", (c) => { body += c; if (body.length > 4000) req.destroy(); });
    req.on("end", async () => {
      let pergunta = "";
      try { pergunta = String(JSON.parse(body).pergunta || "").trim().slice(0, 1000); } catch {}
      if (!pergunta) return send(res, 400, { erro: "pergunta vazia" }, origin);
      try {
        const ac = new AbortController();
        const t = setTimeout(() => ac.abort(), 25000);
        const r = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          signal: ac.signal,
          headers: {
            "x-api-key": API_KEY,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            model: MODEL,
            max_tokens: 320,
            system: SYSTEM,
            messages: [{ role: "user", content: pergunta }],
          }),
        });
        clearTimeout(t);
        if (!r.ok) return send(res, 502, { erro: "upstream " + r.status }, origin);
        const data = await r.json();
        const texto = (data.content?.[0]?.text || "").trim();
        return send(res, 200, { texto }, origin);
      } catch (e) {
        return send(res, 502, { erro: "falha ao consultar a IA" }, origin);
      }
    });
    return;
  }
  send(res, 404, { erro: "not found" }, origin);
});

server.listen(PORT, () => console.log(`assistente Setfree ouvindo em :${PORT} (modelo ${MODEL})`));
