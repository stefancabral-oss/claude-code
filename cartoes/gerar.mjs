// Gera os cartões de visita do time comercial como IMAGEM (PNG), no visual do
// site, prontos para enviar no WhatsApp.
//
// Para cada pessoa em site/src/data/time.json saem dois arquivos em cartoes/out/:
//   <slug>-whatsapp.png  1080×1350 (vertical — formato que preenche a conversa)
//   <slug>-classico.png  2100×1200 (proporção de cartão físico, p/ e-mail e impressão)
//
// A "interatividade" da imagem é o QR code: quem recebe aponta a câmera e cai
// direto no WhatsApp do vendedor com mensagem pronta.
//
// Uso:  cd cartoes && npm install && node gerar.mjs
// Requer o pacote `playwright` disponível (npm i -D playwright, ou global).
import { chromium } from "playwright";
import QRCode from "qrcode";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, "..");
const OUT = path.join(AQUI, "out");
const time = JSON.parse(fs.readFileSync(path.join(RAIZ, "site/src/data/time.json"), "utf8"));

// imagens embutidas como data URI: setContent() não tem base file://, então
// referências a arquivo local não carregariam
const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg" };
const asset = (rel) => {
  const p = path.join(RAIZ, rel.replace(/^\//, ""));
  return `data:${MIME[path.extname(p)] || "image/png"};base64,${fs.readFileSync(p).toString("base64")}`;
};
const b64 = (p) => fs.readFileSync(path.join(AQUI, p)).toString("base64");

/** 5511913685038 → +55 (11) 91368-5038 */
const fmtWa = (d) => d.replace(/^55(\d{2})(\d{5})(\d{4})$/, "+55 ($1) $2-$3");

const FONTES = `
@font-face{font-family:Sora;src:url(data:font/woff2;base64,${b64("fontes/sora.woff2")}) format('woff2');font-weight:100 900}
@font-face{font-family:'Space Grotesk';src:url(data:font/woff2;base64,${b64("fontes/space-grotesk.woff2")}) format('woff2');font-weight:100 900}
*{box-sizing:border-box;margin:0}
body{font-family:Sora,sans-serif;color:#F4F3F0;-webkit-font-smoothing:antialiased}
.sg{font-family:'Space Grotesk',sans-serif}
`;

async function qrSvg(texto) {
  const svg = await QRCode.toString(texto, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 0,
    color: { dark: "#0D0D0D", light: "#0000" },
  });
  return svg.replace("<svg ", '<svg style="width:100%;height:100%;display:block" ');
}

// tile do QR: fundo claro (leitura garantida) + legenda
const qrTile = (svg, escala = 1) => `
<div style="display:flex;flex-direction:column;align-items:center;gap:${14 * escala}px">
  <div style="background:#F4F3F0;border-radius:${14 * escala}px;padding:${18 * escala}px;width:${210 * escala}px;height:${210 * escala}px">${svg}</div>
  <span class="sg" style="font-size:${15 * escala}px;font-weight:600;letter-spacing:.22em;color:rgba(244,243,240,.65)">APONTE A CÂMERA · WHATSAPP</span>
</div>`;

const contato = (rotulo, valor, escala = 1) => `
<div style="display:flex;flex-direction:column;gap:${5 * escala}px">
  <span class="sg" style="font-size:${14 * escala}px;font-weight:600;letter-spacing:.22em;color:rgba(244,243,240,.45)">${rotulo}</span>
  <span style="font-size:${25 * escala}px;font-weight:600;letter-spacing:-.01em">${valor}</span>
</div>`;

// ---------- formato 1: vertical 1080×1350 (WhatsApp) -----------------------------
function htmlWhatsapp(p, qr) {
  const cor = p.cor || "#13BE9F";
  return `<!doctype html><html><head><meta charset="utf-8"><style>${FONTES}</style></head>
<body style="width:1080px;height:1350px;background:#0D0D0D;position:relative;overflow:hidden">
  <img src="${asset(p.pena)}" style="position:absolute;inset:0;width:100%;height:62%;object-fit:cover;object-position:center 30%;opacity:.85">
  <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(13,13,13,.42) 0%,rgba(13,13,13,.05) 34%,#0D0D0D 60%)"></div>

  <div style="position:relative;height:100%;display:flex;flex-direction:column;padding:64px 72px 58px">
    <img src="${asset("/uploads/logo-branco.png")}" style="height:56px;width:auto;align-self:flex-start">

    <div style="margin-top:auto">
      <span class="sg" style="font-size:24px;font-weight:600;letter-spacing:.24em;color:${cor}">${p.cargo.toUpperCase()} · SETFREE</span>
      <h1 style="margin-top:18px;font-size:88px;line-height:1.04;letter-spacing:-.03em;font-weight:600;text-shadow:0 4px 40px rgba(13,13,13,.6)">${p.nome}</h1>

      <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:48px;margin-top:64px">
        <div style="display:flex;flex-direction:column;gap:30px;padding-bottom:6px">
          ${contato("WHATSAPP", fmtWa(p.whatsapp), 1.18)}
          ${contato("E-MAIL", p.email, 1.18)}
          ${contato("SITE", "setfree.com.br", 1.18)}
        </div>
        ${qrTile(qr, 1.06)}
      </div>
    </div>

    <div style="margin-top:56px;border-top:1px solid rgba(244,243,240,.14);padding-top:26px;display:flex;justify-content:space-between;align-items:baseline">
      <span style="font-size:20px;color:rgba(244,243,240,.55)">Do alívio da dor à cura completa.</span>
      <span class="sg" style="font-size:15px;font-weight:600;letter-spacing:.22em;color:rgba(244,243,240,.4)">TECNOLOGIA MÉDICA</span>
    </div>
  </div>
  <div style="position:absolute;left:0;right:0;bottom:0;height:6px;background:linear-gradient(90deg,transparent,${cor} 15%,${cor} 85%,transparent);box-shadow:0 0 30px ${cor}"></div>
</body></html>`;
}

// ---------- formato 2: clássico 2100×1200 (cartão físico) ------------------------
function htmlClassico(p, qr) {
  const cor = p.cor || "#13BE9F";
  return `<!doctype html><html><head><meta charset="utf-8"><style>${FONTES}</style></head>
<body style="width:2100px;height:1200px;background:#0D0D0D;position:relative;overflow:hidden;display:flex">
  <div style="flex:1.25;position:relative;display:flex;flex-direction:column;padding:96px 100px 88px">
    <img src="${asset("/uploads/logo-branco.png")}" style="height:64px;width:auto;align-self:flex-start">
    <div style="margin-top:auto">
      <span class="sg" style="font-size:26px;font-weight:600;letter-spacing:.24em;color:${cor}">${p.cargo.toUpperCase()} · SETFREE</span>
      <h1 style="margin:20px 0 0;font-size:104px;line-height:1.02;letter-spacing:-.03em;font-weight:600">${p.nome}</h1>
      <div style="display:flex;gap:88px;margin-top:78px">
        <div style="display:flex;flex-direction:column;gap:32px">
          ${contato("WHATSAPP", fmtWa(p.whatsapp), 1.35)}
          ${contato("TELEFONE", p.telefone, 1.35)}
        </div>
        <div style="display:flex;flex-direction:column;gap:32px">
          ${contato("E-MAIL", p.email, 1.35)}
          ${contato("SITE", "setfree.com.br", 1.35)}
        </div>
      </div>
    </div>
  </div>

  <div style="flex:.75;position:relative">
    <img src="${asset(p.pena)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 35%;opacity:.9">
    <div style="position:absolute;inset:0;background:linear-gradient(90deg,#0D0D0D 0%,rgba(13,13,13,.25) 45%,rgba(13,13,13,.4) 100%)"></div>
    <div style="position:absolute;right:84px;bottom:84px">${qrTile(qr, 1.25)}</div>
  </div>

  <div style="position:absolute;left:0;right:0;bottom:0;height:8px;background:linear-gradient(90deg,transparent,${cor} 15%,${cor} 85%,transparent);box-shadow:0 0 34px ${cor}"></div>
</body></html>`;
}

// ---------- render ----------------------------------------------------------------
const FORMATOS = [
  { sufixo: "whatsapp", w: 1080, h: 1350, html: htmlWhatsapp },
  { sufixo: "classico", w: 2100, h: 1200, html: htmlClassico },
];

fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();

for (const p of time) {
  // O QR passa pelo domínio (redirect controlado em api/cartoes.json): cada scan
  // é registrado, e o destino pode mudar sem regerar nenhum cartão.
  const destinoQr = `https://setfree.com.br/c/${p.slug}`;
  const qr = await qrSvg(destinoQr);

  for (const fmt of FORMATOS) {
    const pg = await browser.newPage({ viewport: { width: fmt.w, height: fmt.h } });
    await pg.setContent(fmt.html(p, qr), { waitUntil: "networkidle" });
    await pg.waitForTimeout(250);
    const arquivo = path.join(OUT, `${p.slug}-${fmt.sufixo}.png`);
    await pg.screenshot({ path: arquivo });
    await pg.close();
    console.log(`✓ ${path.relative(RAIZ, arquivo)} (${fmt.w}×${fmt.h})`);
  }
}

await browser.close();
console.log(`\n${time.length} pessoa(s) × ${FORMATOS.length} formatos → cartoes/out/`);
