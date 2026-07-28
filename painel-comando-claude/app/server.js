// Criador de Prompt — backend com IA ao vivo (Claude) + loop juiz embutido.
// Guarda a chave da API no servidor (nunca no navegador). Serve o frontend e 3 rotas de IA.
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 8080;
// Modelo pelo que ele faz; troque para "claude-sonnet-5" se quiser mais barato.
const MODEL = process.env.MODEL || "claude-opus-5";

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

const inventory = JSON.parse(fs.readFileSync(path.join(__dirname, "inventory.json"), "utf8"));

// Cliente Anthropic — le ANTHROPIC_API_KEY do ambiente (nunca hardcode).
let client = null;
function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    const e = new Error("ANTHROPIC_API_KEY nao configurada no servidor.");
    e.code = "NO_KEY";
    throw e;
  }
  if (!client) client = new Anthropic();
  return client;
}

// Extrai o JSON estruturado do primeiro bloco de texto da resposta.
function readJson(resp) {
  if (resp.stop_reason === "refusal") {
    const e = new Error("O modelo recusou o pedido por politica de seguranca.");
    e.code = "REFUSAL";
    throw e;
  }
  const block = (resp.content || []).find((b) => b.type === "text");
  if (!block) throw new Error("Resposta vazia do modelo.");
  return JSON.parse(block.text);
}

function invText() {
  const linha = (arr) => arr.map((x) => `- ${x.nome}: ${x.descricao}${x.status ? ` (${x.status})` : ""}`).join("\n");
  return [
    "SKILLS (habilidades prontas):", linha(inventory.skills),
    "\nPLUGINS (pacotes de skills):", linha(inventory.plugins),
    "\nCONECTORES (fontes de dados):", linha(inventory.conectores),
  ].join("\n");
}

// ---------- Rota: inventario (o que posso usar) ----------
app.get("/api/inventory", (_req, res) => res.json(inventory));

// ---------- Rota: PLAN — a IA entende, sugere ferramentas e faz as perguntas dela ----------
const PLAN_SCHEMA = {
  type: "object", additionalProperties: false,
  required: ["entendimento", "ferramentas", "perguntas"],
  properties: {
    entendimento: { type: "string", description: "Em 1-2 frases, o que voce entendeu que a pessoa quer." },
    ferramentas: {
      type: "array",
      items: {
        type: "object", additionalProperties: false,
        required: ["nome", "tipo", "motivo"],
        properties: {
          nome: { type: "string" },
          tipo: { type: "string", enum: ["skill", "plugin", "conector", "nenhuma"] },
          motivo: { type: "string" },
        },
      },
    },
    perguntas: {
      type: "array",
      items: {
        type: "object", additionalProperties: false,
        required: ["id", "pergunta", "tipo"],
        properties: {
          id: { type: "string" },
          pergunta: { type: "string", description: "Uma pergunta clara, em linguagem leiga." },
          ajuda: { type: "string", description: "Frase curta de apoio com exemplo." },
          tipo: { type: "string", enum: ["texto", "escolha"] },
          opcoes: { type: "array", items: { type: "string" } },
        },
      },
    },
  },
};

app.post("/api/plan", async (req, res) => {
  const objetivo = String(req.body?.objetivo || "").trim();
  if (!objetivo) return res.status(400).json({ erro: "Escreva o objetivo primeiro." });
  try {
    const resp = await getClient().messages.create({
      model: MODEL,
      max_tokens: 8000,
      output_config: { effort: "medium", format: { type: "json_schema", schema: PLAN_SCHEMA } },
      system:
        "Voce ajuda uma pessoa NAO tecnica de uma PME brasileira a montar um pedido para o Claude. " +
        "A partir do OBJETIVO dela: (1) diga em 1-2 frases o que entendeu; (2) sugira, SO da lista de ferramentas disponiveis abaixo, o que usar e por que (no maximo 3; use tipo 'nenhuma' se nada se aplica); (3) liste de 2 a 4 perguntas curtas que VOCE precisa fazer para tirar suas duvidas sobre o que fazer e como sera a entrega (formato, destino, detalhes). Portugues do Brasil, linguagem simples. Nao invente ferramentas fora da lista.\n\nFERRAMENTAS DISPONIVEIS:\n" +
        invText(),
      messages: [{ role: "user", content: `OBJETIVO: ${objetivo}` }],
    });
    res.json(readJson(resp));
  } catch (err) {
    handleErr(res, err);
  }
});

// ---------- Rota: COMPOSE — monta o prompt e roda o loop juiz embutido ----------
const COMPOSE_SCHEMA = {
  type: "object", additionalProperties: false,
  required: ["prompt_final", "melhorias"],
  properties: {
    prompt_final: { type: "string", description: "O prompt final, robusto e pronto para colar no Claude." },
    melhorias: { type: "array", items: { type: "string" }, description: "O que o loop juiz melhorou em relacao ao rascunho." },
  },
};

app.post("/api/compose", async (req, res) => {
  const objetivo = String(req.body?.objetivo || "").trim();
  const respostas = req.body?.respostas || {};
  const ferramentas = req.body?.ferramentas || [];
  if (!objetivo) return res.status(400).json({ erro: "Objetivo ausente." });
  try {
    const contexto = [
      `OBJETIVO: ${objetivo}`,
      `FERRAMENTAS ESCOLHIDAS: ${ferramentas.length ? ferramentas.join(", ") : "deixar o Claude decidir"}`,
      "RESPOSTAS DA PESSOA:",
      ...Object.entries(respostas).map(([k, v]) => `- ${k}: ${v}`),
    ].join("\n");
    const resp = await getClient().messages.create({
      model: MODEL,
      max_tokens: 12000,
      output_config: { effort: "high", format: { type: "json_schema", schema: COMPOSE_SCHEMA } },
      system:
        "Voce e um engenheiro de prompt senior. Com o objetivo, as respostas e as ferramentas abaixo: " +
        "PRIMEIRO escreva mentalmente um rascunho do prompt; DEPOIS revise-o com olhar critico (loop juiz) — cheque clareza, se a entrega esta bem definida, se as ferramentas certas sao acionadas, se falta contexto ou restricao — e produza a versao FINAL, mais robusta e profissional que a escrita comum. " +
        "O prompt final deve, quando fizer sentido: definir o papel, o objetivo, o formato de entrega, onde salvar, quais ferramentas/conectores usar, e uma verificacao final. Escreva em portugues do Brasil, claro e direto, pronto para a pessoa colar no Claude. Em 'melhorias', liste o que o loop juiz corrigiu.",
      messages: [{ role: "user", content: contexto }],
    });
    res.json(readJson(resp));
  } catch (err) {
    handleErr(res, err);
  }
});

function handleErr(res, err) {
  console.error(err?.message || err);
  if (err.code === "NO_KEY") return res.status(503).json({ erro: "O servidor esta sem a chave da API do Claude. Configure ANTHROPIC_API_KEY e reinicie." });
  if (err.code === "REFUSAL") return res.status(422).json({ erro: "O modelo recusou este pedido. Reescreva o objetivo." });
  if (err.status === 401) return res.status(401).json({ erro: "Chave da API invalida." });
  if (err.status === 429) return res.status(429).json({ erro: "Limite de uso atingido. Tente de novo em instantes." });
  res.status(500).json({ erro: "Erro ao falar com a IA. Tente novamente." });
}

app.get("/health", (_req, res) => res.json({ ok: true, model: MODEL, temKey: !!process.env.ANTHROPIC_API_KEY }));

app.listen(PORT, () => console.log(`Criador de Prompt rodando na porta ${PORT} (modelo ${MODEL})`));
