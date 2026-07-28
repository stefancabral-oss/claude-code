// Extrai os objetos `d` dos .dc.html de produto/solução para JSON, sem transcrever
// nada à mão. Uso pontual durante a migração: node scripts/extrair-dados.mjs
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

const ARQUIVOS = [
  "Geister", "Radimed", "MarrowCellution", "CoreBone", "Lipsus", "Dentsply", "ParceirosEstrategicos",
  "Licitacoes", "RegistroAnvisa", "Sourcing", "EntradaMercado", "ConsultoriaComercial", "Qualidade",
];

const saida = {};
for (const nome of ARQUIVOS) {
  const src = fs.readFileSync(path.join(RAIZ, `${nome}.dc.html`), "utf8");
  const m = src.match(/return\s*\{\s*d:\s*(\{[\s\S]*?\})\s*\};\s*\n\s*\}/);
  if (!m) {
    console.error(`✖ ${nome}: não achei o objeto d`);
    continue;
  }
  saida[nome] = vm.runInNewContext(`(${m[1]})`);
  const campos = Object.keys(saida[nome]).length;
  console.log(`✓ ${nome.padEnd(24)} ${campos} campos`);
}

fs.writeFileSync(
  path.join(path.dirname(fileURLToPath(import.meta.url)), "dados-extraidos.json"),
  JSON.stringify(saida, null, 2),
);
console.log(`\n→ scripts/dados-extraidos.json (${Object.keys(saida).length} páginas)`);
