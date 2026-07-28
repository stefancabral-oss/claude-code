// "Editais do dia" — consulta a API pública do PNCP (compras.gov.br) e devolve
// os pregões eletrônicos ABERTOS cujo objeto casa com o portfólio da Setfree.
// Sem dependências (fetch nativo). Cache em memória de 1h para não martelar o PNCP.
//
// GET /api/editais  → { atualizado, total, editais: [{objeto, orgao, unidade, uf, encerra, valor, link}] }

const PNCP = "https://pncp.gov.br/api/consulta/v1/contratacoes/proposta";
const MODALIDADE_PREGAO = 8;
const PAGINAS = 4;            // ~200 registros varridos por atualização
const TAMANHO = 50;
const MAX_RESULT = 8;
const TTL_MS = 60 * 60 * 1000; // 1h

// termos do portfólio Setfree (dispositivos médico-hospitalares)
const TERMOS = [
  /hospital/i, /m[eé]dic/i, /cir[uú]rg/i, /sa[uú]de/i, /enxerto/i, /(^|\s)[oó]sse|osso/i,
  /medula/i, /radiofrequ/i, /c[âa]nula/i, /agulha/i, /instrumental/i, /[oó]rtese/i,
  /pr[oó]tese/i, /implante/i, /odontol/i, /oftalm/i, /bi[oó]psia/i, /l[âa]mina cir/i,
  /descart[aá]ve(l|is)\s+m[eé]dic|material\s+m[eé]dic|insumo\s+hospitalar/i,
];

const cache = { at: 0, payload: null };

function yyyymmdd(d) {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}

function linkPNCP(numeroControle) {
  // formato: "CNPJ-1-SEQ/ANO"
  const m = /^(\d+)-\d+-(\d+)\/(\d+)$/.exec(numeroControle || "");
  if (!m) return "https://pncp.gov.br/app/editais";
  return `https://pncp.gov.br/app/editais/${m[1]}/${m[3]}/${parseInt(m[2], 10)}`;
}

function combina(objeto) {
  return TERMOS.some((re) => re.test(objeto || ""));
}

async function buscar() {
  const dataFinal = yyyymmdd(new Date());
  const vistos = new Set();
  const achados = [];
  for (let pagina = 1; pagina <= PAGINAS; pagina++) {
    const url = `${PNCP}?dataFinal=${dataFinal}&codigoModalidadeContratacao=${MODALIDADE_PREGAO}&pagina=${pagina}&tamanhoPagina=${TAMANHO}`;
    let d;
    try {
      const ac = new AbortController();
      const t = setTimeout(() => ac.abort(), 12000);
      const r = await fetch(url, { headers: { accept: "application/json" }, signal: ac.signal });
      clearTimeout(t);
      if (!r.ok) break;
      d = await r.json();
    } catch { break; }
    for (const it of d.data || []) {
      if (!combina(it.objetoCompra)) continue;
      const id = it.numeroControlePNCP;
      if (vistos.has(id)) continue;
      vistos.add(id);
      achados.push({
        objeto: (it.objetoCompra || "").trim().replace(/\s+/g, " ").slice(0, 180),
        orgao: it.orgaoEntidade?.razaoSocial || "",
        unidade: it.unidadeOrgao?.nomeUnidade || "",
        uf: it.unidadeOrgao?.ufSigla || "",
        encerra: it.dataEncerramentoProposta || "",
        valor: it.valorTotalEstimado ?? null,
        link: linkPNCP(id),
      });
    }
    if (d.paginasRestantes === 0) break;
  }
  achados.sort((a, b) => String(a.encerra).localeCompare(String(b.encerra)));
  return achados.slice(0, MAX_RESULT);
}

export async function editaisHandler() {
  if (cache.payload && Date.now() - cache.at < TTL_MS) return cache.payload;
  const editais = await buscar();
  cache.payload = { atualizado: new Date().toISOString(), total: editais.length, editais };
  cache.at = Date.now();
  return cache.payload;
}
