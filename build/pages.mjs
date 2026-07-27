// Mapa de páginas → URL limpa, <title> (≤60 chars) e og:image.
// Fonte da verdade do build. Editar aqui ao adicionar/renomear páginas.
export const SITE = "https://setfree.com.br";

export const PAGES = [
  { file: "Home.dc.html",                  url: "/",                                 title: "Setfree — Importação e distribuição de tecnologia médica", og: "/uploads/asa-institucional-7penas.jpg" },
  { file: "Solucoes.dc.html",              url: "/solucoes",                         title: "Soluções: regulatório, qualidade e licitações | Setfree",  og: "/uploads/asa-linha-azul.jpg" },
  { file: "Tecnologias.dc.html",           url: "/tecnologias",                      title: "Tecnologias — 7 linhas de dispositivos médicos | Setfree", og: "/uploads/asa-institucional-7penas.jpg" },
  { file: "Sobre.dc.html",                 url: "/sobre",                            title: "Sobre a Setfree — importadora de tecnologia médica",       og: "/uploads/asa-institucional-7penas.jpg" },
  { file: "NossaEsperanca.dc.html",        url: "/nossa-esperanca",                  title: "Nossa Esperança — o manifesto da marca Setfree",           og: "/uploads/pena-casa-verde.jpg" },
  { file: "Contato.dc.html",               url: "/contato",                          title: "Contato — cotações, licitações e parcerias | Setfree",     og: "/uploads/asa-institucional-7penas.jpg" },

  { file: "Geister.dc.html",               url: "/tecnologias/geister",              title: "Micro Knifes Geister — microcirurgia de precisão | Setfree", og: "/uploads/pena-sf02-aco.jpg" },
  { file: "Radimed.dc.html",               url: "/tecnologias/radimed",              title: "Radimed — radiofrequência para dor crônica | Setfree",      og: "/uploads/pena-sf03-coral.jpg" },
  { file: "MarrowCellution.dc.html",       url: "/tecnologias/marrow-cellution",     title: "Marrow Cellution — aspiração de medula óssea | Setfree",    og: "/uploads/pena-sf06-marinho.jpg" },
  { file: "CoreBone.dc.html",              url: "/tecnologias/corebone",             title: "CoreBone — enxerto ósseo bioativo de coral | Setfree",      og: "/uploads/pena-sf01-ceu.jpg" },
  { file: "Lipsus.dc.html",                url: "/tecnologias/lipsus",               title: "Lipsus — umedecimento labial pós-cirúrgico | Setfree",      og: "/uploads/pena-sf04-violeta.jpg" },
  { file: "Dentsply.dc.html",              url: "/tecnologias/dentsply",             title: "Dentsply Sirona OSSIX — regeneração óssea guiada | Setfree", og: "/uploads/pena-sf05-ambar.jpg" },
  { file: "ParceirosEstrategicos.dc.html", url: "/tecnologias/parceiros-estrategicos", title: "Parceiros Estratégicos — linha hospitalar | Setfree",     og: "/uploads/pena-sf07-grafite.jpg" },

  { file: "Licitacoes.dc.html",            url: "/solucoes/licitacoes",              title: "Licitações públicas de saúde (PNCP) | Setfree",             og: "/uploads/solucoes/licitacoes.png" },
  { file: "RegistroAnvisa.dc.html",        url: "/solucoes/registro-anvisa",         title: "Registro ANVISA de dispositivos médicos | Setfree",         og: "/uploads/solucoes/anvisa.png" },
  { file: "Sourcing.dc.html",              url: "/solucoes/sourcing",                title: "Sourcing internacional de tecnologia médica | Setfree",     og: "/uploads/solucoes/sourcing.png" },
  { file: "EntradaMercado.dc.html",        url: "/solucoes/entrada-mercado",         title: "Entrada no mercado brasileiro de med-tech | Setfree",       og: "/uploads/solucoes/entrada.png" },
  { file: "ConsultoriaComercial.dc.html",  url: "/solucoes/consultoria-comercial",   title: "Consultoria comercial em dispositivos médicos | Setfree",   og: "/uploads/solucoes/consultoria.png" },
  { file: "Qualidade.dc.html",             url: "/solucoes/qualidade",               title: "Gestão da qualidade e regulatório | Setfree",               og: "/uploads/solucoes/qualidade.png" },
];

// Componentes/templates que NÃO viram página (renderizados via dc-import).
export const COMPONENTS = ["SiteNav.dc.html", "SiteFooter.dc.html", "LinhaPage.dc.html", "SolucaoPage.dc.html"];

// file → url, para reescrever links internos .dc.html em URLs limpas.
export const FILE_TO_URL = Object.fromEntries(PAGES.map(p => [p.file, p.url]));
