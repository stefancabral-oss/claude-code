// Rotas e strings da moldura nos dois idiomas.
//
// O site antigo trocava o idioma mexendo no DOM (atributos data-en + localStorage),
// então o inglês não tinha URL nenhuma — nem o Google nem os robôs de IA
// conseguiam ler o conteúdo em inglês. Aqui cada idioma é uma rota real, com
// hreflang recíproco.

export const LANGS = ["pt", "en"] as const;
export type Lang = (typeof LANGS)[number];

export const HTML_LANG: Record<Lang, string> = { pt: "pt-BR", en: "en" };

// Segmentos de seção por idioma. Os slugs de produto (geister, corebone…) são
// nomes de marca e não mudam.
export const SEG: Record<Lang, { tec: string; sol: string }> = {
  pt: { tec: "tecnologias", sol: "solucoes" },
  en: { tec: "technology", sol: "solutions" },
};

/** Prefixo do idioma: "" para pt, "/en" para en. */
export const prefix = (lang: Lang) => (lang === "pt" ? "" : `/${lang}`);

/** Rotas fixas — a chave é a mesma nos dois idiomas. */
const PATHS = {
  home: { pt: "/", en: "/en/" },
  solucoes: { pt: "/solucoes", en: "/en/solutions" },
  tecnologias: { pt: "/tecnologias", en: "/en/technology" },
  sobre: { pt: "/sobre", en: "/en/about" },
  esperanca: { pt: "/nossa-esperanca", en: "/en/our-hope" },
  contato: { pt: "/contato", en: "/en/contact" },
} as const;

export type RouteKey = keyof typeof PATHS;

export const route = (key: RouteKey, lang: Lang) => PATHS[key][lang];
export const linhaUrl = (slug: string, lang: Lang) => `${prefix(lang)}/${SEG[lang].tec}/${slug}`;
export const solucaoUrl = (slug: string, lang: Lang) => `${prefix(lang)}/${SEG[lang].sol}/${slug}`;

/** Dado o caminho numa língua, devolve o equivalente na outra (para o toggle e o hreflang). */
export function alternate(path: string, from: Lang, to: Lang): string {
  if (from === to) return path;
  for (const key of Object.keys(PATHS) as RouteKey[]) {
    if (PATHS[key][from] === path) return PATHS[key][to];
  }
  const tec = new RegExp(`^${prefix(from)}/${SEG[from].tec}/(.+)$`);
  const sol = new RegExp(`^${prefix(from)}/${SEG[from].sol}/(.+)$`);
  const mt = path.match(tec);
  if (mt) return linhaUrl(mt[1], to);
  const ms = path.match(sol);
  if (ms) return solucaoUrl(ms[1], to);
  return PATHS.home[to];
}

/** Strings da moldura: nav, rodapé e rótulos repetidos nos templates. */
export const UI = {
  nav: {
    solucoes: { pt: "SOLUÇÕES", en: "SOLUTIONS" },
    tecnologias: { pt: "TECNOLOGIA", en: "TECHNOLOGY" },
    sobre: { pt: "SOBRE", en: "ABOUT" },
    esperanca: { pt: "NOSSA ESPERANÇA", en: "OUR HOPE" },
    contato: { pt: "CONTATO", en: "CONTACT" },
    whatsapp: { pt: "WHATSAPP", en: "WHATSAPP" },
    falarWhats: { pt: "Falar no WhatsApp", en: "Talk on WhatsApp" },
    abrirMenu: { pt: "Abrir menu", en: "Open menu" },
    fecharMenu: { pt: "Fechar menu", en: "Close menu" },
  },
  linha: {
    overview: { pt: "VISÃO GERAL", en: "OVERVIEW" },
    especificacoes: { pt: "ESPECIFICAÇÕES", en: "SPECIFICATIONS" },
    modoUso: { pt: "MODO DE USO", en: "HOW TO USE" },
    modoUsoT: { pt: "Manejo preciso, sempre", en: "Precise handling, always" },
    modoUsoNota: {
      pt: "Resumo apenas para referência. Siga sempre as Instruções de Uso do fabricante.",
      en: "Summary for reference only. Always follow the manufacturer's Instructions for Use.",
    },
    aplicacoes: { pt: "APLICAÇÕES", en: "APPLICATIONS" },
    cotacao: { pt: "COTAÇÃO", en: "QUOTE" },
    cotacaoT: { pt: "Solicitar cotação", en: "Request a quote" },
    cotacaoD: {
      pt: "Venda direta, distribuidores e licitações — especificações verificadas e preços auditáveis.",
      en: "Direct sale, distributors and public tenders — verified specs and auditable prices.",
    },
    falarWhatsSeta: { pt: "Falar no WhatsApp ↗", en: "Talk on WhatsApp ↗" },
    falarEspecialista: { pt: "Falar com especialista", en: "Talk to a specialist" },
    catalogoD: {
      pt: "Material técnico completo para avaliação e instrução de edital.",
      en: "Complete technical material for evaluation and tender documentation.",
    },
    baixar: { pt: "Baixar ↓", en: "Download ↓" },
    outras: { pt: "Outras tecnologias", en: "Other technologies" },
    verTodas: { pt: "Ver todas →", en: "See all →" },
    penaAlt: { pt: "Pena da linha", en: "Feather of the" },
  },
  cnn: {
    kicker: { pt: "MÍDIA — CNN BUSINESS", en: "MEDIA — CNN BUSINESS" },
    t: { pt: "Por dentro da fazenda de corais do CoreBone", en: "Inside CoreBone's coral farm" },
    d: {
      pt: "A CNN Business mostrou a fabricação, a aplicabilidade e os benefícios do enxerto bioativo.",
      en: "CNN Business covered the manufacturing, applicability and benefits of the bioactive graft.",
    },
    link: { pt: "Ver matéria ↗", en: "See the story ↗" },
  },
} as const;

/** Açúcar: t(UI.nav.sobre, lang) */
export const t = <T extends Record<Lang, string>>(entry: T, lang: Lang): string => entry[lang];

/**
 * Texto bilíngue no ponto de uso: L(lang, "Fale conosco", "Talk to us").
 * É o mesmo par que o export do Claude Design guardava no atributo data-en —
 * mantê-los lado a lado deixa a revisão da tradução óbvia no diff.
 */
export const L = (lang: Lang, pt: string, en: string): string => (lang === "pt" ? pt : en);

export const WHATSAPP = "https://wa.me/5511913685038";
export const EMAIL = "contato@setfree.com.br";
export const TELEFONE = "+55 (11) 4318-7341";
export const TELEFONE_HREF = "tel:+551143187341";
