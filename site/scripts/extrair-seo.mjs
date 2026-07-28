// Extrai do <helmet> de cada .dc.html a meta description e o JSON-LD específico
// da página, e casa com o título definido em build/pages.mjs. Nada é transcrito à
// mão — os números de registro ANVISA dentro do JSON-LD são conteúdo regulado.
//
// As URLs absolutas viram placeholder {{SITE}}, para o build montar o domínio.
// Uso pontual durante a migração: node scripts/extrair-seo.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PAGES } from "../../build/pages.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(HERE, "..", "..");
const PROD = "https://setfree.com.br";

const seo = {};
for (const p of PAGES) {
  const src = fs.readFileSync(path.join(RAIZ, p.file), "utf8");
  const helmet = (src.match(/<helmet>([\s\S]*?)<\/helmet>/i) || [, ""])[1];

  const desc = (helmet.match(/<meta name="description" content="([^"]*)"/i) || [, ""])[1]
    .replaceAll("&quot;", '"')
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");

  // o graph da organização já é global no Base.astro; aqui só o schema da página
  const ld = [...helmet.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)]
    .map((m) => JSON.parse(m[1]))
    .filter((x) => !x["@graph"]);

  seo[p.url] = {
    file: p.file,
    title: p.title,
    description: desc,
    og: p.og,
    jsonLd: JSON.parse(JSON.stringify(ld).replaceAll(PROD, "{{SITE}}")),
  };
}

fs.writeFileSync(path.join(HERE, "..", "src", "data", "seo.pt.json"), JSON.stringify(seo, null, 2) + "\n");

const semDesc = Object.entries(seo).filter(([, v]) => !v.description).map(([k]) => k);
const semLd = Object.entries(seo).filter(([, v]) => v.jsonLd.length === 0).map(([k]) => k);
console.log(`✓ seo.pt.json — ${Object.keys(seo).length} páginas`);
if (semDesc.length) console.log(`  ⚠ sem meta description: ${semDesc.join(", ")}`);
if (semLd.length) console.log(`  ⚠ sem JSON-LD próprio: ${semLd.join(", ")}`);
