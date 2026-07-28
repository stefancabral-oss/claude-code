# Guia — SEO e visibilidade em IAs (GEO) · setfree.com.br

O que já está pronto neste projeto e o que fazer no deploy e depois dele.

> **Nota (migração para Astro).** Este guia foi escrito para o site anterior, que
> renderizava no cliente. O **Passo 1 inteiro está resolvido**: o Astro emite
> HTML estático, as URLs limpas são a própria estrutura de arquivos, o 301 das
> `*.dc.html` está no `deploy/nginx.conf`, e o `robots.txt`, `sitemap.xml` e
> `llms.txt` são gerados no build a partir das rotas reais. O **PT/EN deixou de
> ser `data-en`** e virou rota (`/en/…`) com `hreflang` recíproco — as 19 páginas
> viraram 38. O que continua valendo é o **Passo 2 em diante**: são dados que só
> a empresa tem. Roteiro de deploy: `PLANO-IMPLANTACAO.md`.

## O que já está embutido (38 páginas — 19 PT + 19 EN)
- **JSON-LD (schema.org)** em cada página: MedicalOrganization + WebSite em todas, Product/Brand/manufacturer nas 7 linhas, Service nas 6 soluções, BreadcrumbList nas internas.
- **Meta description, Open Graph, Twitter Card e canonical** por página.
- **PT/EN como rotas reais**, com `hreflang` recíproco e `x-default`.
- Arquivos de raiz gerados no build: `robots.txt` (libera GPTBot, ClaudeBot, PerplexityBot, Google-Extended etc.), `sitemap.xml` (38 URLs com alternates) e `llms.txt` (resumo da empresa para LLMs, montado dos mesmos dados das páginas).

## Passo 1 — Deploy correto (o mais importante) · ✅ resolvido na migração
1. ~~**Exportar HTML estático.**~~ Feito: o build do Astro emite HTML puro, com o conteúdo no corpo da página (não mais dentro de `<noscript>`).
2. Publicar robots.txt, sitemap.xml e llms.txt **na raiz do domínio** (setfree.com.br/robots.txt etc.).
3. URLs limpas conforme o sitemap (/tecnologias/geister, não /Geister.dc.html). Redirect 301 das URLs antigas do site atual.
4. HTTPS, uma única versão canônica (sem www ou com — escolher uma).

## Passo 2 — Completar dados que só a empresa tem
No JSON-LD da Home (Home.dc.html) e no llms.txt, adicionar quando tiver em mãos:
- CNPJ (campo taxID), endereço completo (streetAddress, postalCode), e-mail.
- Números de registro ANVISA por produto (campo identifier em cada Product) — é o tipo de dado verificável que faz uma IA citar a Setfree como fonte.
- sameAs: links de LinkedIn, Instagram, perfil no PNCP/gov.br.

## Passo 3 — Cadastros (1 dia, grátis)
- Google Search Console + Bing Webmaster Tools: enviar o sitemap. Bing alimenta ChatGPT/Copilot.
- Google Business Profile (Cotia-SP).
- Conferir/criar presença em bases que as IAs consultam: LinkedIn da empresa, CNPJ público consistente.

## Passo 4 — Conteúdo que as IAs citam (contínuo)
- **Páginas de resposta**: uma página por pergunta real de cliente ("O que é aspirado de medula óssea?", "Como funciona o registro ANVISA de importados?"). Adicionar FAQPage em JSON-LD nelas.
- **Fatos verificáveis** em texto corrido: fabricante, país de origem, registro, indicações. IAs citam quem dá o dado exato.
- Atualizar lastmod no sitemap a cada mudança; conteúdo datado envelhecido derruba citação.
- Manter llms.txt sincronizado quando entrar linha nova.

## Passo 5 — Performance e acessibilidade (afeta ranking)
- Converter fotos para WebP/AVIF; loading="lazy" abaixo da dobra (o vídeo do hero já tem poster).
- alt descritivo em toda imagem de produto (nome + fabricante).
- Título único ≤60 caracteres por página (já definidos; conferir no export).
- hreflang pt-BR/en quando a versão EN tiver URLs próprias (/en/...).

## Como medir
- Search Console: consultas e cliques.
- Perguntar periodicamente a ChatGPT/Claude/Perplexity: "quem distribui Marrow Cellution no Brasil?" — a meta é a Setfree aparecer citada com link.
