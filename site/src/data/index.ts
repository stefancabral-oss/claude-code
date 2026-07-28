// Junta os dados em português com as traduções em inglês.
//
// Os JSON .en.json trazem só os campos traduzíveis; tudo que não é texto (imagem,
// cor, código, slug das relacionadas) vem do .pt.json. Assim uma imagem trocada
// no português não precisa ser repetida no inglês — e não tem como divergir.

import linhasPt from "./linhas.pt.json";
import linhasEn from "./linhas.en.json";
import solucoesPt from "./solucoes.pt.json";
import solucoesEn from "./solucoes.en.json";
import type { Lang } from "../lib/i18n";

export interface Feat {
  t: string;
  d: string;
}
export interface Modelo {
  img: string;
  t: string;
  d: string;
  patch?: boolean;
}
export interface Espec {
  k: string;
  v: string;
}
export interface Passo {
  n: string;
  d: string;
}
export interface Relacionada {
  slug: string;
  pena?: string;
}

export interface Linha {
  slug: string;
  nome: string;
  cat: string;
  tagline: string;
  pena: string;
  cor: string;
  corClara: string;
  codigo: string;
  corNome: string;
  prod?: string;
  overviewT?: string;
  overview?: string;
  featsKicker?: string;
  featsT?: string;
  feats?: Feat[];
  modelosKicker?: string;
  modelosT?: string;
  modelos?: Modelo[];
  especsT?: string;
  especs?: Espec[];
  uso?: Passo[];
  aplicT?: string;
  aplicacoes?: string[];
  catalogo?: string;
  catalogoLabel?: string;
  catalogoKicker?: string;
  catalogoNome?: string;
  cnn?: boolean;
  outras: Relacionada[];
}

export interface Publico {
  t: string;
  d: string;
}

export interface Solucao {
  slug: string;
  nome: string;
  num: string;
  img: string;
  tagline: string;
  incluiT: string;
  itens: string[];
  publicoT: string;
  publico: Publico[];
  ctaT: string;
  editaisAoVivo?: boolean;
  outras: Relacionada[];
}

/** Mescla elemento a elemento, preservando os campos que só existem no português. */
function mesclaLista<T extends object>(pt: T[] | undefined, en: Partial<T>[] | undefined, onde: string): T[] | undefined {
  if (!pt) return undefined;
  if (!en) return pt;
  if (pt.length !== en.length) {
    throw new Error(
      `Tradução fora de sincronia em ${onde}: ${pt.length} item(ns) em pt, ${en.length} em en. ` +
        `As listas precisam ter o mesmo tamanho para casar item a item.`,
    );
  }
  return pt.map((item, i) => ({ ...item, ...en[i] }));
}

function mescla<T extends { slug: string }>(pt: T[], en: Partial<T>[], tipo: string): T[] {
  return pt.map((base) => {
    const trad = en.find((x) => x.slug === base.slug);
    if (!trad) throw new Error(`Falta tradução em inglês para ${tipo}/${base.slug}`);

    const out = { ...base, ...trad } as T & Record<string, unknown>;
    for (const campo of ["feats", "modelos", "especs", "uso", "publico"] as const) {
      const lpt = (base as Record<string, unknown>)[campo] as object[] | undefined;
      const len = (trad as Record<string, unknown>)[campo] as object[] | undefined;
      if (lpt) out[campo] = mesclaLista(lpt, len, `${tipo}/${base.slug}.${campo}`);
    }
    // listas de string simples (aplicacoes, itens) vêm inteiras da tradução
    for (const campo of ["aplicacoes", "itens"] as const) {
      const lpt = (base as Record<string, unknown>)[campo] as string[] | undefined;
      const len = (trad as Record<string, unknown>)[campo] as string[] | undefined;
      if (lpt && len && lpt.length !== len.length) {
        throw new Error(
          `Tradução fora de sincronia em ${tipo}/${base.slug}.${campo}: ${lpt.length} em pt, ${len.length} em en.`,
        );
      }
    }
    return out;
  });
}

const LINHAS: Record<Lang, Linha[]> = {
  pt: linhasPt as Linha[],
  en: mescla(linhasPt as Linha[], linhasEn as Partial<Linha>[], "linhas"),
};

const SOLUCOES: Record<Lang, Solucao[]> = {
  pt: solucoesPt as Solucao[],
  en: mescla(solucoesPt as Solucao[], solucoesEn as Partial<Solucao>[], "solucoes"),
};

export const linhas = (lang: Lang): Linha[] => LINHAS[lang];
export const solucoes = (lang: Lang): Solucao[] => SOLUCOES[lang];

export const linha = (slug: string, lang: Lang): Linha => {
  const x = LINHAS[lang].find((l) => l.slug === slug);
  if (!x) throw new Error(`Linha desconhecida: ${slug}`);
  return x;
};
export const solucao = (slug: string, lang: Lang): Solucao => {
  const x = SOLUCOES[lang].find((s) => s.slug === slug);
  if (!x) throw new Error(`Solução desconhecida: ${slug}`);
  return x;
};
