// vCard de cada membro do time — o "Salvar contato na agenda" do cartão digital.
// Gerado no build a partir de src/data/time.json; iPhone e Android abrem
// direto na agenda.
import type { APIRoute } from "astro";
import time from "../../data/time.json";

export function getStaticPaths() {
  return time.map((p) => ({ params: { slug: p.slug }, props: { p } }));
}

export const GET: APIRoute = ({ props, site }) => {
  const p = props.p as (typeof time)[number];
  const SITE = site!.href.replace(/\/+$/, "");
  const cel = `+${p.whatsapp}`;
  const fixo = p.telefone.replace(/[^\d+]/g, "");

  const vcf = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${p.sobrenome};${p.primeiroNome};;;`,
    `FN:${p.nome}`,
    "ORG:Setfree",
    `TITLE:${p.cargo}`,
    `TEL;TYPE=CELL,VOICE:${cel}`,
    ...(fixo && fixo !== cel ? [`TEL;TYPE=WORK,VOICE:${fixo}`] : []),
    `EMAIL;TYPE=WORK:${p.email}`,
    `URL:${SITE}`,
    `URL:${SITE}/cartao/${p.slug}`,
    "ADR;TYPE=WORK:;;Rodovia Raposo Tavares KM 22 - The Square Open Mall;Cotia;SP;;Brasil",
    "NOTE:Setfree — importação e distribuição de tecnologia médica. Do alívio da dor à cura completa.",
    "END:VCARD",
    "",
  ].join("\r\n");

  return new Response(vcf, {
    headers: {
      "content-type": "text/vcard; charset=utf-8",
      "content-disposition": `attachment; filename="${p.slug}-setfree.vcf"`,
    },
  });
};
