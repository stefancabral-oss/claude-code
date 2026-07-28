// Compara o texto visível de cada página do site antigo (dist/ do pré-render)
// com o da nova (Astro), para achar conteúdo que se perdeu na migração.
// Uso: node scripts/comparar-paridade.mjs <urlAntigo> <urlNovo>
const ANTIGO = process.argv[2] || "http://127.0.0.1:8080";
const NOVO = process.argv[3] || "http://127.0.0.1:8099";

const URLS = [
  "/", "/solucoes", "/tecnologias", "/sobre", "/nossa-esperanca", "/contato",
  "/tecnologias/geister", "/tecnologias/radimed", "/tecnologias/marrow-cellution",
  "/tecnologias/corebone", "/tecnologias/lipsus", "/tecnologias/dentsply",
  "/tecnologias/parceiros-estrategicos",
  "/solucoes/licitacoes", "/solucoes/registro-anvisa", "/solucoes/sourcing",
  "/solucoes/entrada-mercado", "/solucoes/consultoria-comercial", "/solucoes/qualidade",
];

// frases do texto visível, normalizadas
function frases(html) {
  const corpo = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, "\n");
  return new Set(
    corpo
      .split("\n")
      .map((s) =>
        s
          .replace(/&nbsp;/g, " ")
          .replace(/&amp;/g, "&")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/\s+/g, " ")
          .trim(),
      )
      .filter((s) => s.length > 25 && /[a-zà-ú]{4}/i.test(s)),
  );
}

const pegar = async (base, u) => {
  const r = await fetch(base + u);
  if (!r.ok) throw new Error(`${base}${u} → ${r.status}`);
  return r.text();
};

let faltando = 0;
let paginas = 0;
for (const u of URLS) {
  const [a, b] = await Promise.all([pegar(ANTIGO, u), pegar(NOVO, u)]);
  const fa = frases(a);
  const fb = frases(b);
  const perdidas = [...fa].filter((f) => !fb.has(f));
  paginas++;
  if (perdidas.length === 0) {
    console.log(`✓ ${u}`);
  } else {
    faltando += perdidas.length;
    console.log(`✗ ${u} — ${perdidas.length} trecho(s) só no site antigo:`);
    for (const p of perdidas.slice(0, 6)) console.log(`    · ${p.slice(0, 120)}`);
    if (perdidas.length > 6) console.log(`    … e mais ${perdidas.length - 6}`);
  }
}
console.log(`\n${paginas} páginas · ${faltando} trecho(s) ausentes no site novo`);
