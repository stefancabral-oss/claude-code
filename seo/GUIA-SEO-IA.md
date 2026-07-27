# Guia — SEO e visibilidade em IAs (GEO) · setfree.com.br

O que já está pronto neste projeto e o que fazer no deploy e depois dele.

## O que já está embutido (19 páginas)
- **JSON-LD (schema.org)** em cada página: MedicalOrganization + WebSite na Home, Product/Brand/manufacturer nas 7 linhas, Service nas 6 soluções, AboutPage/ContactPage/CollectionPage nas demais.
- **Meta description, Open Graph e canonical** por página.
- **PT/EN** com data-en (para hreflang no futuro).
- Arquivos de raiz prontos em /seo: robots.txt (libera GPTBot, ClaudeBot, PerplexityBot, Google-Extended etc.), sitemap.xml (19 URLs), llms.txt (resumo da empresa para LLMs).

## Passo 1 — Deploy correto (o mais importante)
1. **Exportar HTML estático.** As páginas hoje renderizam via JavaScript; vários crawlers de IA (GPTBot, ClaudeBot) NÃO executam JS. No empacotamento final, gere HTML puro com o conteúdo já renderizado (pre-render/SSG). Sem isso, nada do resto adianta.
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
