# Análise completa — Site Setfree

> Auditoria técnica do export do Claude Design (22 páginas `.dc.html` + `support.js`).
> Foco pedido: **SEO**, **IA embutida** e **conteúdo dinâmico** (não estático).
> Data: 2026-07-27.

---

## Resumo executivo

O site está **muito bem feito no visual e na base de SEO** — identidade forte (preto `#0D0D0D`, verde `#13BE9F`, off-white `#F4F3F0`, Sora + Space Grotesk), JSON-LD em todas as páginas de conteúdo, meta description / Open Graph / canonical por página, versão PT/EN embutida e uma esteira de licitações que conta a história certa.

Mas há **um problema que anula quase todo o resto** e alguns ajustes importantes. Em ordem de impacto:

| # | Problema | Impacto | Esforço |
|---|----------|---------|---------|
| **P0** | Site 100% renderizado por JavaScript → páginas de produto ficam **vazias** para IA/Google | 🔴 Crítico | Alto |
| **P0** | **Nenhuma** das 22 páginas tem `<title>` | 🔴 Crítico | Baixo |
| **P0** | A IA embutida (Assistente Setfree) **só funciona no preview** do Claude Design, quebra em produção | 🔴 Crítico | Médio |
| **P1** | Links internos usam `Arquivo.dc.html`, mas sitemap/JSON-LD usam URLs limpas (`/tecnologias/geister`) | 🟠 Alto | Médio |
| **P1** | JSON-LD de Produto sem registro ANVISA, imagem, SKU — falta o dado que faz a IA citar | 🟠 Alto | Baixo |
| **P1** | Sem `BreadcrumbList` e sem `FAQPage` (o schema que mais gera citação em IA) | 🟠 Alto | Médio |
| **P1** | `og:image` ausente em 100% das páginas; assets quebrados (logo do JSON-LD e PDFs de catálogo) | 🟠 Alto | Baixo |
| **P2** | ~8,6 MB de PNGs (produtos/soluções) sem WebP/AVIF; React+fontes via CDN externa | 🟡 Médio | Baixo |
| **P2** | Inconsistências: e-mail `@setfree.med.br` × site `setfree.com.br`; Brandbook 14,5 MB e screenshots soltos no deploy | 🟡 Médio | Baixo |

**A boa notícia:** o que você pediu — "SEO e IA embutidos, não estático, gerar informações automaticamente quando alguém abre / olha para algum lugar" — é totalmente viável, e o site já tem os ganchos para isso (`data-reveal`/IntersectionObserver para "olhar", assistente de IA já desenhado). Falta trocar a fundação de renderização e ligar a IA a um backend real. Detalho na seção 3.

---

## 1. Diagnóstico técnico

### A. Renderização client-side — o problema nº 1 🔴

As páginas renderizam via `support.js`, que baixa **React 18 + Babel Standalone da unpkg.com** e monta o conteúdo no navegador a partir dos templates `<x-dc>` e do `renderVals()` em cada página.

Crawlers de IA (**GPTBot, ClaudeBot, PerplexityBot, CCBot**) e o **primeiro passe do Googlebot não executam JavaScript**. Medi o que eles enxergam hoje (texto visível, fora de `<script>`/`<style>`):

| Página | Texto visível sem JS |
|---|---|
| Home | 2.990 caracteres (hero + seções literais; **falta o portfólio**, que vem do JS) |
| **Geister** | **0 caracteres** |
| **CoreBone** | **0 caracteres** |
| **Licitações** | **0 caracteres** |
| Tecnologias | 485 caracteres (os 7 cards vêm do JS) |
| Soluções | 428 caracteres (os cards vêm do JS) |
| Sobre | 1.300 caracteres |
| Contato | 1.185 caracteres |

**As 7 páginas de linha de produto e as 6 de solução — as mais importantes comercialmente — chegam vazias para a IA e para o Google.** Só sobrevivem a meta description e o JSON-LD. Não há `<noscript>` de fallback em nenhuma página.

> Este é o "Passo 1" que o próprio `seo/GUIA-SEO-IA.md` já apontava. Sem resolver, os outros 90% de SEO não têm efeito.

**Correção:** gerar HTML pré-renderizado (SSG/pre-render) — o conteúdo já montado no HTML entregue, com o JavaScript apenas hidratando as animações por cima. Opções na seção 3.

### B. SEO on-page — títulos ausentes 🔴

- **`<title>` ausente em 100% das páginas** (22/22). Só existe `og:title`. O `<title>` é o campo isolado mais importante para busca e para o texto do link nos resultados. Hoje a aba do navegador e o snippet ficam sem título definido.
- Meta description, Open Graph e canonical: ✅ presentes em todas as páginas de conteúdo (ausentes só nos 4 componentes/templates `SiteNav`, `SiteFooter`, `LinhaPage`, `SolucaoPage`, o que é esperado).
- **Duas meta descriptions estão cortadas no meio da palavra:** `Sobre.dc.html` termina em "…comercializar seus produ" e `Tecnologias.dc.html` em "…junto à ANVISA, treinam".
- Falta `<html lang="pt-BR">` — as páginas `.dc.html` usam `<html>` sem `lang` (só o `mapa-brasil.html` tem).
- **Sem `og:image` em 100% das páginas** (cada página tem só og:title/type/url) → compartilhamentos no WhatsApp/LinkedIn/Slack saem **sem imagem** — crítico para um site cuja força é visual. Também faltam `og:site_name` e `og:locale`.
- Sem `<meta name="twitter:card">`/`twitter:image`.

### C. Dados estruturados (JSON-LD) — boa base, faltam peças 🟠

Tipos já usados no site: `MedicalOrganization`, `WebSite`, `Product` (×7), `Offer` (×7), `Service` (×7), `Brand`, `Country`, `AboutPage`, `ContactPage`, `CollectionPage`. Base sólida. Faltam:

- **`identifier` com o registro ANVISA** em cada `Product`. Este é o dado verificável que faz uma IA citar a Setfree como fonte ("o registro ANVISA de X é Y — fonte: setfree.com.br"). Hoje o `Product` do Geister, por exemplo, tem `brand`, `manufacturer` e `offers`, mas **nenhum número de registro, `sku`, `gtin` ou `image`**. (`ParceirosEstrategicos` é ainda mais enxuto: `Product` sem `brand` nem `manufacturer`.)
- **`BreadcrumbList`** — ausente em todo o site. Ajuda o Google a montar a trilha nos resultados.
- **`FAQPage`** — ausente. É o schema que mais gera aparição em IA e em "featured snippets". Casa com o Passo 4 do seu guia (páginas de resposta).
- **`CollectionPage` da página Tecnologias sem `ItemList`/`hasPart`** — não lista os 7 produtos para o crawler, perdendo o grafo do portfólio.
- `MedicalOrganization` sem `taxID` (CNPJ), `email`, `sameAs` (LinkedIn/Instagram/PNCP) e endereço completo (`streetAddress`, `postalCode`).
- **O `logo` do JSON-LD aponta para `https://setfree.com.br/assets/logo.png` — arquivo que não existe no export** (os logos reais estão em `uploads/logo-*.png`). Referência quebrada.

### D. IA embutida — existe, mas quebra em produção 🔴

A página de Contato **já traz o "Assistente Setfree"**: o cliente descreve a necessidade clínica e a IA indica a linha certa. Ótima ideia. Mas o código chama:

```js
if (!window.claude || !window.claude.complete) throw new Error('sem-ia');
const r = await window.claude.complete(prompt);
```

`window.claude.complete` **só existe dentro do preview do Claude Design**. No site publicado esse objeto não existe → cai sempre no `catch` e mostra *"Assistente indisponível agora"*. Ou seja: **a IA que você já embutiu nunca vai responder em produção** do jeito atual.

**Correção:** criar um endpoint de backend (função serverless) que chama a API da Claude com sua chave, e trocar `window.claude.complete(prompt)` por um `fetch('/api/assistente')`. Código pronto na seção 3.

### E. URLs e links internos 🟠

- O sitemap e todos os `canonical`/JSON-LD usam **URLs limpas**: `https://setfree.com.br/tecnologias/geister`.
- Mas os links internos apontam para **nomes de arquivo**: `href="Geister.dc.html"`, `href="Tecnologias.dc.html"`, `href="Contato.dc.html"`.
- No deploy isso precisa virar `/tecnologias/geister` etc., com **redirect 301** das URLs antigas. Se publicar como está, o Google indexa `/Geister.dc.html` (divergente do canonical) e a autoridade se dilui.

### F. Performance 🟡

- **React/ReactDOM + runtime (66 KB)** carregam da unpkg.com a cada página só para montar conteúdo que poderia ser estático — desperdício de CPU/latência e ponto único de falha (se a unpkg cair, a página fica em branco). As **fontes Google** também vêm de CDN externa (render-blocking + questão de LGPD ao expor o IP do visitante ao Google). Recomendo auto-hospedar as fontes (Sora, Space Grotesk) em WOFF2.
- **Imagens: tudo JPG/PNG, zero WebP/AVIF.** Os maiores ofensores estão em `uploads/produtos/` e `uploads/solucoes/` — **~8,6 MB de PNGs** (ex.: `entrada.png` ~1 MB, `sourcing.png` 981 KB, `corebone.png` 640 KB, `lipsus.png` 652 KB). Converter para WebP corta ~70%. Some-se a isso o **Brandbook v3 (14,5 MB)** e o vídeo do hero (2,4 MB).
- `loading="lazy"` já aparece em várias imagens abaixo da dobra ✅. O vídeo do hero já tem `poster` ✅.
- Metadados do editor Claude Design (`data-props`, seções "Marca") ficaram embutidos no export — inócuos, mas idealmente removidos no build.

### G. Acessibilidade 🟡

- Respeita `prefers-reduced-motion` ✅ (bom, dado o volume de animação).
- Hero da Home usa uma imagem/vídeo com `alt=""`+`aria-hidden` ✅ (decorativo, correto).
- Conferir **texto alternativo descritivo** nas imagens de produto (hoje o `alt` é só o nome; o ideal é "nome + fabricante").
- **Bug de A11y:** em `Solucoes.dc.html` há um link que contém só uma imagem com `alt=""` → link **sem nome acessível** (falha WCAG 2.4.4 / 4.1.2). O mesmo padrão aparece nas miniaturas de "outras linhas" do `LinhaPage`.
- Botões PT/EN do `SiteNav` sem `aria-pressed`.
- Hierarquia de headings correta **quando o JS roda** (um `<h1>` por página) — mas **sem JS não há heading nenhum** (ver item A).
- Contraste do verde `#13BE9F` sobre off-white em textos pequenos precisa de verificação (o verde é usado sobretudo em labels e links, geralmente ok; confirmar nos textos de 11–12px).

### H. Idioma / internacionalização 🟡

- PT/EN embutido via `data-en` + toggle no `SiteNav` (guarda a preferência em `localStorage`) ✅.
- **Não** há detecção automática por `navigator.language` nem por geolocalização — um visitante de fora do Brasil vê português por padrão.
- **Não** há URLs próprias por idioma (`/en/...`) nem `hreflang`. Para o EN pontuar em busca, precisa de URL própria + `hreflang pt-BR/en`.

### I. Inconsistências e higiene de deploy 🟡

- **Domínio de e-mail divergente:** o site inteiro usa `setfree.com.br` (126 ocorrências), mas os e-mails apontam para `contato@setfree.med.br` (7 ocorrências). Confirmar qual é o correto e padronizar (inclusive no JSON-LD).
- **Botões "Baixar catálogo (PDF)" quebrados:** `Tecnologias`, `Geister`, `Radimed` e `MarrowCellution` apontam para `https://setfree.com.br/assets/catalogos/*.pdf` — pasta que **não existe** no export. Publicar os PDFs ou remover os botões.
- **Brandbook v3 (14,5 MB PDF)** e três **"Captura de Tela …png"** (nomes com espaço e acento, que quebram em URL) estão em `uploads/` e iriam para o ar sem necessidade. Mover para fora do que é publicado.
- `mapa-brasil.html` está **órfão** (nenhuma página o referencia; a Home usa `uploads/mapa-1000.png`) e baixa d3/topojson/mapa-múndi de 3 CDNs em runtime. Decidir qual é a fonte de verdade.

---

## 2. O que já está ótimo (manter)

- Identidade visual coesa e memorável; narrativa "dor → alívio → cura → liberdade".
- JSON-LD presente em toda página de conteúdo — base rara de ver.
- `robots.txt` liberando explicitamente GPTBot, ClaudeBot, PerplexityBot, Google-Extended etc.
- `llms.txt` (resumo da empresa para LLMs) e `sitemap.xml` com 19 URLs limpas.
- Esteira de licitações "ao vivo", assistente de IA e formulário que já viram mensagem de WhatsApp pronta.
- `prefers-reduced-motion` respeitado.

---

## 3. O que você pediu: SEO + IA embutidos e conteúdo dinâmico

> *"Preciso ter SEO e IA embutido no site e não ser estático. Gerar informações automaticamente quando alguém abre ele, olha para algum lugar etc."*

Isso exige duas mudanças de fundação. Nenhuma é grande, mas ambas são necessárias.

### 3.1 Fundação A — Pré-renderizar (resolve SEO **e** libera a IA de crawler)

Publicar o site num host que serve **HTML já renderizado** e permite **funções serverless**. Recomendo **Cloudflare Pages** ou **Vercel** (ambos com plano grátis suficiente e URLs limpas nativas). Fluxo:

1. Um passo de build roda o `support.js` uma vez (headless) e grava o HTML final de cada página → o conteúdo dos 7 produtos e 6 soluções passa a existir no HTML entregue.
2. As animações continuam via JS por cima (hidratação).
3. URLs limpas + 301 das antigas + `robots/sitemap/llms.txt` na raiz.

Com isso, **as páginas de produto deixam de chegar vazias** para IA e Google — e todo o JSON-LD e o `llms.txt` finalmente têm efeito.

### 3.2 Fundação B — Um endpoint de IA de verdade

Trocar o `window.claude.complete` (preview-only) por uma função serverless que fala com a API da Claude. Exemplo (Cloudflare/Vercel):

```js
// /api/assistente  (serverless) — a chave fica no servidor, nunca no HTML
export async function onRequestPost({ request, env }) {
  const { pergunta } = await request.json();
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-5",           // rápido e barato para atendimento
      max_tokens: 300,
      system: "Você é o assistente comercial da Setfree… (mesmo prompt do site)",
      messages: [{ role: "user", content: pergunta }],
    }),
  });
  const data = await r.json();
  return Response.json({ texto: data.content?.[0]?.text ?? "" });
}
```

E no site, no lugar do bloco quebrado:

```js
const r = await fetch("/api/assistente", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ pergunta: q }),
}).then((x) => x.json());
this.setState({ aiBusy: false, aiText: r.texto, aiWa: wa });
```

### 3.3 "Gerar informações automaticamente quando alguém abre / olha para algum lugar"

Com as duas fundações no lugar, dá para ligar recursos generativos e dinâmicos. Do mais simples ao mais avançado:

**a) Ao abrir — personalização por contexto (sem custo de IA, instantâneo)**
Detectar `referrer`, `utm_*`, idioma do navegador e horário, e adaptar o hero e a chamada:
- Veio de uma busca por "enxerto ósseo"? Hero entra já falando de CoreBone.
- Idioma do navegador em inglês / acesso de fora do BR? Abre em EN e destaca "market entry".
- Comprador público (veio do PNCP/gov.br)? Destaca a esteira de licitações e o "Enviar edital".

**b) Ao rolar / "olhar para algum lugar" — conteúdo sob demanda (IntersectionObserver)**
O site já usa `data-reveal` + IntersectionObserver para animar seções ao entrarem na tela. O mesmo gatilho pode **buscar/gerar informação** quando a seção fica visível:
- Card de produto entra na tela → carrega **status ANVISA e disponibilidade em tempo real** (de uma API sua).
- Seção de licitações entra na tela → mostra **editais relevantes do dia** (do seu pipeline PNCP), em vez do texto fixo "ao vivo".
- Ao parar sobre uma linha por alguns segundos (hover/dwell) → gera um **resumo clínico curto** ("quando indicar", "3 diferenciais") com a IA, em cache.

**c) Conteúdo generativo com cache (bom para SEO *e* para o usuário)**
Gerar, no build, **páginas de resposta** ("O que é aspirado de medula óssea?", "Como funciona o registro ANVISA de importados?") com `FAQPage` em JSON-LD. Isso é exatamente o que as IAs citam — e, gerado no build, é rápido e indexável. É o "Passo 4" do seu guia, automatizável.

**d) Assistente que já qualifica o lead**
Evoluir o Assistente Setfree: além de indicar a linha, ele monta o rascunho de cotação (perfil, itens, urgência) e entrega no WhatsApp já estruturado — reduz atrito e organiza o funil.

> ⚠️ Regra de ouro no seu setor: IA **orienta, não diagnostica**. Todo texto gerado deve manter o aviso que já existe no site ("indicação final confirmada por especialistas") e nunca inventar registro/indicação. Fatos verificáveis (ANVISA, fabricante) vêm de dados seus, não do modelo.

---

## 4. Plano priorizado

**P0 — antes de divulgar o site (fundação)**
1. Pré-renderizar (SSG/hidratação) — resolve o item A.
2. Adicionar `<title>` único (≤60 caracteres) e `<html lang="pt-BR">` em cada página.
3. Ligar a IA a um endpoint real (3.2) — destrava o assistente.
4. URLs limpas + 301 + publicar `robots/sitemap/llms.txt` na raiz.

**P1 — nas duas semanas seguintes**
5. Enriquecer `Product` (registro ANVISA, `image`, `sku`) e `MedicalOrganization` (CNPJ, e-mail, `sameAs`).
6. Adicionar `BreadcrumbList` em produtos/soluções e `FAQPage` nas páginas de resposta.
7. `og:image` por página; padronizar o domínio de e-mail.
8. Personalização ao abrir (3.3a) + editais do dia na seção de licitações (3.3b).

**P2 — otimização contínua**
9. Imagens WebP/AVIF; auto-hospedar fontes; remover Brandbook/screenshots do deploy.
10. URLs `/en/...` + `hreflang` para a versão inglês.
11. Google Search Console + Bing Webmaster (Bing alimenta ChatGPT/Copilot) + Google Business Profile.
12. Páginas de resposta generativas com cache (3.3c) e evolução do assistente (3.3d).

---

## 5. Como medir

- **Search Console / Bing Webmaster:** consultas, cliques, páginas indexadas.
- **Teste de crawler:** `curl` na URL de produto e confirmar que o texto aparece **sem** JS.
- **Teste de IA (mensal):** perguntar ao ChatGPT / Claude / Perplexity *"quem distribui Marrow Cellution no Brasil?"* — meta: a Setfree aparecer citada, com link.
- **Rich Results Test** (Google) para validar cada JSON-LD.
