// Título, meta description, og:image e JSON-LD de cada página, nos dois idiomas.
//
// A chave é sempre a URL em português — ela identifica a página, independentemente
// do idioma. O JSON-LD é escrito uma vez (em pt, com {{SITE}} no lugar do domínio)
// e reaproveitado no inglês trocando url/@id e o texto traduzido: assim os números
// de registro ANVISA existem num lugar só e não têm como divergir entre idiomas.

import seoPt from "../data/seo.pt.json";
import seoEn from "../data/seo.en.json";
import { alternate, type Lang } from "./i18n";

interface EntradaPt {
  file: string;
  title: string;
  description: string;
  og: string;
  jsonLd: Record<string, unknown>[];
}
interface EntradaEn {
  title: string;
  description: string;
}

const PT = seoPt as Record<string, EntradaPt>;
const EN = seoEn as Record<string, EntradaEn>;

export interface Seo {
  title: string;
  description: string;
  og: string;
  jsonLd: Record<string, unknown>[];
}

/**
 * @param urlPt caminho canônico em português — a identidade da página
 * @param lang  idioma desejado
 */
export function seo(urlPt: string, lang: Lang): Seo {
  const base = PT[urlPt];
  if (!base) throw new Error(`Sem SEO cadastrado para ${urlPt} (ver src/data/seo.pt.json)`);

  if (lang === "pt") {
    return { title: base.title, description: base.description, og: base.og, jsonLd: base.jsonLd };
  }

  const trad = EN[urlPt];
  if (!trad) throw new Error(`Falta título/description em inglês para ${urlPt} (ver src/data/seo.en.json)`);

  const urlEn = alternate(urlPt, "pt", "en");
  const jsonLd = base.jsonLd.map((s) => {
    const o = { ...s } as Record<string, unknown>;
    if (typeof o.url === "string") o.url = o.url.replace(urlPt === "/" ? /\/$/ : urlPt, urlEn);
    if (typeof o.description === "string") o.description = trad.description;
    o.inLanguage = "en";
    return o;
  });

  return { title: trad.title, description: trad.description, og: base.og, jsonLd };
}

/** Troca o placeholder {{SITE}} pelo domínio real do build. */
export const comDominio = <T>(x: T, site: string): T =>
  JSON.parse(JSON.stringify(x).replaceAll("{{SITE}}", site)) as T;

/** Todas as URLs (em português) que têm SEO cadastrado — base do sitemap. */
export const urlsPt = () => Object.keys(PT);
