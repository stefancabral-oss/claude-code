// Pré-render do site Setfree (export Claude Design) para HTML indexável por IA/Google.
//
// O que faz, sem alterar o comportamento visual do site:
//  1. Auto-hospeda React/ReactDOM (remove a dependência de unpkg.com em runtime).
//  2. Renderiza cada página com Chromium (Playwright) e captura o conteúdo montado.
//  3. Hasteia o <helmet> (JSON-LD, meta description, canonical, og) para o <head> real.
//  4. Injeta <title> único, <html lang="pt-BR">, og:image + Twitter Card.
//  5. Coloca o conteúdo renderizado num <noscript> — robôs sem JS (GPTBot, ClaudeBot)
//     passam a ler o texto; o navegador ignora e roda o site interativo normalmente.
//  6. Reescreve links internos .dc.html → URLs limpas (/tecnologias/geister).
//  7. Grava dist/ com estrutura de URLs limpas + robots/sitemap/llms.txt na raiz.
//
// Uso:  node build/prerender.mjs
import { chromium } from "playwright";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PAGES, COMPONENTS, FILE_TO_URL, SITE, PROD_SITE, IS_PROD_SITE } from "./pages.mjs";

const ROOT = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const STAGE = path.join(ROOT, "build", ".staging");
const DIST = path.join(ROOT, "dist");
const VENDOR = path.join(ROOT, "build", "vendor");
const CHROME = "/opt/pw-browsers/chromium/chrome-linux/chrome";

// Em produção é no-op. Fora dela, troca o domínio fixo (JSON-LD das páginas,
// sitemap, llms.txt) pelo SITE_URL do ambiente.
const retarget = (s) => (IS_PROD_SITE ? s : s.replaceAll(PROD_SITE, SITE));

const rm = (p) => fs.rmSync(p, { recursive: true, force: true });
const cpDir = (a, b) => fs.existsSync(a) && fs.cpSync(a, b, { recursive: true });
const read = (p) => fs.readFileSync(p, "utf8");
const write = (p, s) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };

// --- 1. Staging: cópia do site com support.js apontando para /vendor -------------
function buildStage() {
  rm(STAGE); fs.mkdirSync(STAGE, { recursive: true });
  for (const f of fs.readdirSync(ROOT)) {
    if (["build", "dist", ".git", "node_modules", "ANALISE.md", "README.md"].includes(f)) continue;
    cpDir(path.join(ROOT, f), path.join(STAGE, f));
  }
  // auto-hospedar React e Babel: troca as URLs unpkg do support.js por /vendor/*
  // (Babel é obrigatório: o support.js compila o JSX das páginas em runtime — sem ele
  //  o dc-root fica vazio e o pré-render sai com 0 chars.)
  const sj = path.join(STAGE, "support.js");
  let js = read(sj)
    .replaceAll("https://unpkg.com/react@18.3.1/umd/react.production.min.js", "/vendor/react.production.min.js")
    .replaceAll("https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js", "/vendor/react-dom.production.min.js")
    .replaceAll("https://unpkg.com/@babel/standalone@7.29.0/babel.min.js", "/vendor/babel.min.js");
  write(sj, js);
  cpDir(VENDOR, path.join(STAGE, "vendor"));
}

// --- servidor estático simples sobre o staging -----------------------------------
const MIME = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".mp4": "video/mp4", ".svg": "image/svg+xml", ".xml": "application/xml", ".txt": "text/plain" };
function serve(dir) {
  return http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split("?")[0]);
    let fp = path.join(dir, p);
    if (fs.existsSync(fp) && fs.statSync(fp).isFile()) {
      res.setHeader("content-type", MIME[path.extname(fp)] || "application/octet-stream");
      fs.createReadStream(fp).pipe(res);
    } else { res.statusCode = 404; res.end("404"); }
  });
}

// --- reescrita de links internos .dc.html → URLs limpas --------------------------
function rewriteLinks(html) {
  for (const [file, url] of Object.entries(FILE_TO_URL)) {
    html = html.replaceAll(`href="${file}"`, `href="${url}"`).replaceAll(`href='${file}'`, `href='${url}'`);
    // links com âncora/params: File.dc.html#x
    html = html.replace(new RegExp(`href=(["'])${file.replace(/[.]/g, "\\.")}([#?][^"']*)?\\1`, "g"), (_m, q, tail = "") => `href=${q}${url}${tail || ""}${q}`);
  }
  return html;
}

// --- BreadcrumbList (schema.org) a partir da URL limpa ---------------------------
function crumbName(url) {
  const p = PAGES.find((x) => x.url === url);
  return p ? p.title.split(/ — | \| |: /)[0].trim() : url;
}
function breadcrumbLd(cfg) {
  if (cfg.url === "/") return "";
  const segs = cfg.url.split("/").filter(Boolean);
  const items = [{ name: "Início", url: "/" }];
  let acc = "";
  for (const s of segs) { acc += "/" + s; items.push({ name: crumbName(acc), url: acc }); }
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: SITE + it.url })),
  };
  return `<script type="application/ld+json">${JSON.stringify(ld)}</script>`;
}

// --- montagem do HTML final de uma página ----------------------------------------
function assemble(rawFile, cfg, rendered) {
  let raw = read(rawFile);

  // extrai o conteúdo do <helmet> (fica dentro de <x-dc>) para hastear ao <head>
  const helmet = (raw.match(/<helmet>([\s\S]*?)<\/helmet>/i) || [, ""])[1].trim();

  const canonical = `${SITE}${cfg.url === "/" ? "/" : cfg.url}`;
  const ogImg = `${SITE}${cfg.og}`;
  const headExtra = [
    `<title>${cfg.title}</title>`,
    helmet,
    `<meta property="og:image" content="${ogImg}">`,
    `<meta property="og:image:alt" content="Setfree — tecnologia médica">`,
    `<meta property="og:site_name" content="Setfree">`,
    `<meta property="og:locale" content="pt_BR">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${cfg.title}">`,
    `<meta name="twitter:image" content="${ogImg}">`,
    `<link rel="alternate" hreflang="pt-BR" href="${canonical}">`,
    breadcrumbLd(cfg),
    `<base href="/">`,
    // personalização por origem: visitante de fora do BR abre em inglês (o SiteNav lê sf-lang)
    `<script>try{var L=(navigator.language||"").toLowerCase();if(!localStorage.getItem("sf-lang")&&L&&L.slice(0,2)!=="pt"){localStorage.setItem("sf-lang","en")}}catch(e){}</script>`,
  ].join("\n");

  // <html lang="pt-BR">
  raw = raw.replace(/<html(\s[^>]*)?>/i, `<html lang="pt-BR">`);
  // injeta no <head> (logo após o charset)
  raw = raw.replace(/<meta charset="utf-8">/i, `<meta charset="utf-8">\n${headExtra}`);

  // noscript com o conteúdo renderizado (robôs sem JS leem; navegador ignora)
  const noscript = `<noscript>\n<div id="sf-prerender">${rewriteLinks(rendered)}</div>\n</noscript>`;
  raw = raw.replace(/<body([^>]*)>/i, `<body$1>\n${noscript}`);

  return retarget(rewriteLinks(raw));
}

// --- copia assets estáticos para dist --------------------------------------------
function copyAssets() {
  rm(DIST); fs.mkdirSync(DIST, { recursive: true });
  cpDir(path.join(STAGE, "uploads"), path.join(DIST, "uploads"));
  cpDir(path.join(STAGE, "vendor"), path.join(DIST, "vendor"));
  fs.copyFileSync(path.join(STAGE, "support.js"), path.join(DIST, "support.js"));
  // componentes (dc-import) precisam existir no mesmo host — e passam pelo mesmo
  // rewrite de links das páginas: o menu e o rodapé aparecem em todas elas, e sem
  // isso cada clique cairia num .dc.html (404 sem o nginx; 301 desnecessário com ele).
  for (const c of COMPONENTS) write(path.join(DIST, c), rewriteLinks(read(path.join(STAGE, c))));
  // arquivos SEO vão para a RAIZ do domínio
  for (const f of ["robots.txt", "sitemap.xml", "llms.txt"]) {
    const src = path.join(STAGE, "seo", f);
    if (fs.existsSync(src)) write(path.join(DIST, f), retarget(read(src)));
  }
  // fora de produção, nenhum robô indexa: staging com conteúdo igual ao do site
  // real vira conteúdo duplicado e pode canibalizar o domínio de verdade.
  if (!IS_PROD_SITE) {
    write(path.join(DIST, "robots.txt"), `# build de ${SITE} (nao-producao)\nUser-agent: *\nDisallow: /\n`);
  }
  // remove o Brandbook e screenshots do que é publicado
  const up = path.join(DIST, "uploads");
  for (const f of fs.readdirSync(up)) {
    if (f.endsWith(".pdf") || f.startsWith("Captura de Tela")) rm(path.join(up, f));
  }
}

async function main() {
  console.log(`• domínio do build: ${SITE}${IS_PROD_SITE ? "" : "  (nao-producao → robots.txt bloqueia tudo)"}`);
  console.log("• staging + auto-host React"); buildStage();
  console.log("• copiando assets → dist"); copyAssets();

  const react = read(path.join(VENDOR, "react.production.min.js"));
  const reactDom = read(path.join(VENDOR, "react-dom.production.min.js"));
  const babel = read(path.join(VENDOR, "babel.min.js"));

  const srv = serve(STAGE); await new Promise((r) => srv.listen(0, r));
  const port = srv.address().port;
  const browser = await chromium.launch({ executablePath: fs.existsSync(CHROME) ? CHROME : undefined });

  let ok = 0, warn = 0;
  for (const cfg of PAGES) {
    const pg = await browser.newPage();
    await pg.addInitScript(() => { window.__PRERENDER__ = true; }); // widgets dinâmicos ficam no estado inicial
    // dentro do sandbox unpkg é bloqueado → servimos React local; stubs para o resto
    await pg.route("**/*", (route) => {
      const u = route.request().url();
      if (u.includes("/vendor/react-dom")) return route.fulfill({ contentType: "application/javascript", body: reactDom });
      if (u.includes("/vendor/react")) return route.fulfill({ contentType: "application/javascript", body: react });
      if (u.includes("/vendor/babel")) return route.fulfill({ contentType: "application/javascript", body: babel });
      if (u.includes("fonts.googleapis") || u.includes("fonts.gstatic") || u.includes("cloudfront") || u.includes("jsdelivr") || u.includes("unpkg"))
        return route.fulfill({ status: 200, body: "" });
      return route.continue();
    });
    try { await pg.goto(`http://127.0.0.1:${port}/${cfg.file}`, { waitUntil: "load", timeout: 20000 }); } catch {}
    await pg.waitForTimeout(2200);
    const rendered = await pg.evaluate(() => {
      const el = document.getElementById("dc-root");
      return el ? el.innerHTML : "";
    });
    await pg.close();

    const html = assemble(path.join(STAGE, cfg.file), cfg, rendered);
    const out = cfg.url === "/" ? path.join(DIST, "index.html") : path.join(DIST, cfg.url, "index.html");
    write(out, html);

    const len = rendered.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().length;
    if (len > 150) ok++; else { warn++; console.log(`  ⚠ ${cfg.file} renderizou pouco (${len} chars)`); }
    console.log(`  ✓ ${cfg.url.padEnd(34)} ${len} chars  "${cfg.title.slice(0, 40)}…"`);
  }

  await browser.close(); srv.close();
  console.log(`\n✔ ${PAGES.length} páginas · ${ok} com conteúdo · ${warn} avisos → dist/`);
}
main().catch((e) => { console.error(e); process.exit(1); });
