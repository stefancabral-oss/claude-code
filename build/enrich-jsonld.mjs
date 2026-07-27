// Enriquece o JSON-LD (schema.org Product) das páginas de produto com:
//   - identifier: registro(s) ANVISA (PropertyValue) — dado verificável p/ SEO/IA
//   - image: imagem do produto (URL absoluta)
//   - category: "Dispositivo médico" (se ausente)
// Fonte dos registros: build/anvisa.json. Idempotente (sobrescreve identifier/image).
// Uso: node build/enrich-jsonld.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SITE } from "./pages.mjs";

const ROOT = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const data = JSON.parse(fs.readFileSync(path.join(ROOT, "build", "anvisa.json"), "utf8")).produtos;

const RE = /(<script type="application\/ld\+json">)(\{[\s\S]*?\})(<\/script>)/;

let changed = 0;
for (const [file, info] of Object.entries(data)) {
  const fp = path.join(ROOT, file);
  if (!fs.existsSync(fp)) { console.log("  ⚠ não achei", file); continue; }
  let html = fs.readFileSync(fp, "utf8");
  const m = html.match(RE);
  if (!m) { console.log("  ⚠ sem JSON-LD:", file); continue; }
  let ld;
  try { ld = JSON.parse(m[2]); } catch { console.log("  ⚠ JSON-LD inválido:", file); continue; }
  if (ld["@type"] !== "Product") { console.log("  ⚠ não é Product:", file); continue; }

  if (info.anvisa && info.anvisa.length) {
    ld.identifier = info.anvisa.map((n) => ({ "@type": "PropertyValue", propertyID: "Registro ANVISA", value: n }));
  }
  if (info.image) ld.image = SITE + info.image;
  if (!ld.category) ld.category = "Dispositivo médico";

  const out = html.replace(RE, `$1${JSON.stringify(ld)}$3`);
  if (out !== html) { fs.writeFileSync(fp, out); changed++; }
  const reg = info.anvisa?.length ? info.anvisa.join(", ") : "— (pendente)";
  console.log(`  ✓ ${file.padEnd(30)} ANVISA: ${reg}`);
}
console.log(`\n✔ ${changed} arquivos atualizados`);
