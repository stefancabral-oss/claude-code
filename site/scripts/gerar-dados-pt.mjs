// Converte scripts/dados-extraidos.json nos JSON de dados em português usados
// pelo site, normalizando o que era específico do export do Claude Design:
//   uploads/x.jpg        → /uploads/x.jpg
//   href: Radimed.dc.html → slug: radimed
// Uso pontual durante a migração: node scripts/gerar-dados-pt.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const bruto = JSON.parse(fs.readFileSync(path.join(HERE, "dados-extraidos.json"), "utf8"));

const SLUG = {
  Geister: "geister",
  Radimed: "radimed",
  MarrowCellution: "marrow-cellution",
  CoreBone: "corebone",
  Lipsus: "lipsus",
  Dentsply: "dentsply",
  ParceirosEstrategicos: "parceiros-estrategicos",
  Licitacoes: "licitacoes",
  RegistroAnvisa: "registro-anvisa",
  Sourcing: "sourcing",
  EntradaMercado: "entrada-mercado",
  ConsultoriaComercial: "consultoria-comercial",
  Qualidade: "qualidade",
};
const LINHAS = ["Geister", "Radimed", "MarrowCellution", "CoreBone", "Lipsus", "Dentsply", "ParceirosEstrategicos"];

/** uploads/x.jpg → /uploads/x.jpg (já absoluto fica como está) */
const asset = (p) => (typeof p === "string" && p && !p.startsWith("/") ? `/${p}` : p);

function normaliza(chave, d) {
  const o = { slug: SLUG[chave], ...d };
  for (const campo of ["pena", "prod", "img", "catalogo"]) if (o[campo]) o[campo] = asset(o[campo]);
  if (Array.isArray(o.modelos)) o.modelos = o.modelos.map((m) => ({ ...m, img: asset(m.img) }));
  if (Array.isArray(o.outras)) {
    o.outras = o.outras.map((x) => {
      const alvo = Object.entries(SLUG).find(([k]) => x.href === `${k}.dc.html`);
      if (!alvo) throw new Error(`${chave}: href desconhecido em outras: ${x.href}`);
      return { slug: alvo[1], pena: asset(x.pena) };
    });
  }
  return o;
}

const linhas = [];
const solucoes = [];
for (const [chave, d] of Object.entries(bruto)) {
  (LINHAS.includes(chave) ? linhas : solucoes).push(normaliza(chave, d));
}

const DATA = path.join(HERE, "..", "src", "data");
fs.mkdirSync(DATA, { recursive: true });
fs.writeFileSync(path.join(DATA, "linhas.pt.json"), JSON.stringify(linhas, null, 2) + "\n");
fs.writeFileSync(path.join(DATA, "solucoes.pt.json"), JSON.stringify(solucoes, null, 2) + "\n");
console.log(`✓ linhas.pt.json   (${linhas.length})`);
console.log(`✓ solucoes.pt.json (${solucoes.length})`);
