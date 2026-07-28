// Sitemap gerado das rotas reais, com <xhtml:link> recíproco entre PT e EN.
// Substitui o seo/sitemap.xml escrito à mão, que só listava o português e tinha
// as datas fixadas no arquivo.
import type { APIRoute } from "astro";
import { LANGS, alternate, HTML_LANG, type Lang } from "../lib/i18n";
import { urlsPt } from "../lib/seo";

const PRIORIDADE = (urlPt: string) => (urlPt === "/" ? "1.0" : urlPt.split("/").length <= 2 ? "0.8" : "0.7");

export const GET: APIRoute = ({ site }) => {
  const base = site!.href.replace(/\/+$/, "");
  const abs = (p: string) => `${base}${p === "/" ? "/" : p}`;

  const entradas = urlsPt().flatMap((urlPt) =>
    LANGS.map((lang: Lang) => {
      const loc = abs(alternate(urlPt, "pt", lang));
      const alternates = LANGS.map(
        (outro) =>
          `    <xhtml:link rel="alternate" hreflang="${HTML_LANG[outro]}" href="${abs(alternate(urlPt, "pt", outro))}"/>`,
      ).join("\n");
      return [
        "  <url>",
        `    <loc>${loc}</loc>`,
        alternates,
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(urlPt)}"/>`,
        `    <changefreq>monthly</changefreq>`,
        `    <priority>${PRIORIDADE(urlPt)}</priority>`,
        "  </url>",
      ].join("\n");
    }),
  );

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entradas,
    "</urlset>",
    "",
  ].join("\n");

  return new Response(xml, { headers: { "content-type": "application/xml; charset=utf-8" } });
};
