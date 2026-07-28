# Plano de implantação — Dokploy

Runbook de uma passada só, do zero até o site no ar em `setfree.com.br`.
Referência técnica dos serviços: `DEPLOY-DOKPLOY.md`. Auditoria e pendências de
conteúdo: `ANALISE.md`.

Sobem **dois serviços** no mesmo domínio, via um único `docker-compose.yml`:

| Serviço | O que é | Rota | Porta interna |
|---|---|---|---|
| `web` | site estático pré-renderizado (nginx) | `setfree.com.br` | 80 |
| `api` | assistente de IA + editais do PNCP (Node) | `setfree.com.br/api/*` | 8787 |

---

## Fase 0 — Antes de tocar no Dokploy

- [ ] **Código na `main` do repositório que o Dokploy acessa.** Hoje o remoto é
      `github.com/stefancabral-oss/claude-code`. As correções de build estão em
      dois commits (`09a7e1b`, `dd5c71d`) — sem eles o deploy sobe com o
      pré-render vazio e o container da `api` em crash-loop.
- [ ] **Servidor com Docker + Dokploy instalado** e a rede `dokploy-network` já
      existente (o compose a declara como `external: true`; o Dokploy cria essa
      rede sozinho na instalação).
- [ ] **Chave da API da Claude** em mãos (`console.anthropic.com` → API keys).
- [ ] **Acesso ao DNS** de `setfree.com.br`.
- [ ] **Espaço em disco:** a imagem base do Playwright tem ~2 GB. Conte com
      ~6 GB livres para o primeiro build.

---

## Fase 1 — DNS (faça primeiro, o TLS depende disso)

- [ ] Registro **A**: `setfree.com.br` → IP do servidor.
- [ ] Registro **A**: `www.setfree.com.br` → mesmo IP.
- [ ] Se estiver atrás de Cloudflare, deixe em **DNS only** (nuvem cinza) até o
      Let's Encrypt emitir o certificado; proxy laranja antes disso costuma
      quebrar o desafio HTTP-01.
- [ ] Confirme a propagação antes de seguir: `dig +short setfree.com.br`

> O `www` já está coberto: o Traefik emite certificado para ele e faz **301
> para o domínio raiz** (os `canonical` do site são sem `www`, então servir os
> dois hosts seria conteúdo duplicado). O registro A do `www` é necessário
> justamente para o Let's Encrypt validar esse host.

---

## Fase 2 — Criar a aplicação no Dokploy

- [ ] **Create → Compose** (não "Application" — são dois serviços).
- [ ] Provider: o repositório Git; branch **`main`**; Compose Path:
      `docker-compose.yml` (raiz).
- [ ] Aba **Environment**:

```
DOMAIN=setfree.com.br
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-sonnet-5
```

- [ ] Marque a `ANTHROPIC_API_KEY` como **secret**. Ela só existe no container
      da `api` — nunca chega ao HTML. O front chama `/api/assistente` e
      `/api/editais` na mesma origem, sem chave nenhuma no cliente.

> **`DOMAIN` manda no build.** O compose passa `SITE_URL=https://${DOMAIN}` para
> o build do `web`, e é dele que saem `canonical`, `og:url`, `sitemap.xml` e o
> JSON-LD. Se `DOMAIN` for qualquer coisa diferente de `setfree.com.br`, o build
> se marca como não-produção e **gera um `robots.txt` que bloqueia todos os
> robôs** — de propósito, para um ambiente de teste não competir com o site
> real. Um `DOMAIN` errado aqui é a forma mais fácil de subir produção
> desindexada; confira antes do deploy.

---

## Fase 3 — Deploy

- [ ] **Deploy.** O build é `node:22-alpine` + Astro — cerca de **1 a 2
      minutos**. (Até a migração para Astro, este passo baixava a imagem do
      Playwright, ~2 GB, e rodava o pré-render com Chromium.)
- [ ] **Acompanhe o log do build do `web`.** O portão de qualidade é a contagem
      de páginas:

```
38 page(s) built in 1.59s
• uploads → dist/uploads (39 arquivos, …)
```

  São **38 páginas**: 19 em português e 19 em inglês. Número menor significa
  rota faltando — não promova.

- [ ] Log do `api`: deve aparecer
      `assistente Setfree ouvindo em :8787 (modelo claude-sonnet-5)`.
      `ERR_MODULE_NOT_FOUND` aqui significa que o commit `dd5c71d` não subiu.
- [ ] Traefik/Let's Encrypt: confirme o cadeado no navegador. Se o certificado
      não sair, quase sempre é DNS ainda propagando ou proxy do Cloudflare ligado.

---

## Fase 4 — Verificação (rode tudo antes de anunciar)

```bash
# 1. o robô sem JS enxerga o conteúdo? (o texto tem que estar no HTML cru)
curl -s https://setfree.com.br/tecnologias/geister | grep -o "Micro Knifes GEISTER" | head -1

# 2. título único por página
curl -s https://setfree.com.br/tecnologias/corebone | grep -i "<title>"

# 3. URL antiga redireciona 301 para a limpa
curl -sI https://setfree.com.br/CoreBone.dc.html | grep -i location

# 4. assistente de IA responde
curl -s https://setfree.com.br/api/health
curl -s -X POST https://setfree.com.br/api/assistente \
  -H 'content-type: application/json' \
  -d '{"pergunta":"preciso de instrumental para microcirurgia oftálmica"}'

# 5. editais do PNCP
curl -s https://setfree.com.br/api/editais | head -c 300

# 6. arquivos de SEO na raiz — e o robots tem que estar LIBERANDO (Allow: /).
#    "Disallow: /" aqui significa que o build saiu como não-produção: confira o DOMAIN.
curl -s  https://setfree.com.br/robots.txt  | head -3
curl -sI https://setfree.com.br/sitemap.xml | head -1
curl -sI https://setfree.com.br/llms.txt    | head -1

# 6b. HTTP redireciona para HTTPS, e www redireciona para o domínio raiz
curl -sI http://setfree.com.br      | grep -i "^HTTP\|^location"
curl -sI https://www.setfree.com.br | grep -i "^HTTP\|^location"

# 7) versão em inglês no ar, com hreflang recíproco
curl -s  https://setfree.com.br/en/technology/geister | grep -o "<title>[^<]*"
curl -s  https://setfree.com.br/tecnologias/geister   | grep -o 'hreflang="en" href="[^"]*"'

# 8) navegação interna NÃO pode redirecionar (tem que ser 200, não 301)
curl -sI https://setfree.com.br/tecnologias | head -1

# 7. o React e o Babel carregam do próprio domínio (sem unpkg)
curl -sI https://setfree.com.br/vendor/react.production.min.js | head -1
curl -sI https://setfree.com.br/vendor/babel.min.js            | head -1
```

- [ ] No navegador: abrir a home, o console **sem erros de `integrity`**
      (bloqueio de SRI = bundle do `build/vendor/` com bytes errados).
- [ ] **Clicar em cada item do menu do topo** e no rodapé: têm que ir direto
      para a URL limpa, sem passar por 301. Um `.dc.html` na barra de endereço
      significa que o rewrite dos componentes não rodou.
- [ ] Testar em celular: menu, vídeo do hero, botão do WhatsApp.
- [ ] Trocar o idioma PT/EN no topo e conferir que persiste ao navegar.

---

## Fase 5 — Pós-deploy

- [ ] Cadastrar `https://setfree.com.br/sitemap.xml` no **Google Search
      Console** e no **Bing Webmaster Tools**.
- [ ] Pedir indexação da home e de 2–3 páginas de produto.
- [ ] Conferir o consumo da API da Claude no console depois do primeiro dia
      (o endpoint é aberto — ver "Ajustes recomendados").

---

## Rollback

O Dokploy guarda os deploys anteriores: **Deployments → escolher o anterior →
Redeploy**. Como as duas imagens são construídas do zero a cada deploy e não há
banco nem estado persistido, o rollback é limpo — nada de migração para
desfazer. Em último caso, `git revert` do commit problemático e novo deploy.

---

## Ajustes recomendados (não bloqueiam o deploy)

1. **`/api/assistente` é aberto e gasta tokens.** Sem rate limit, qualquer um
   pode consumir a chave. Um middleware `rateLimit` do Traefik no router da
   `api` (ex.: 10 req/min por IP) resolve com uma linha de label.
2. **Sem healthcheck no compose.** O Traefik só sabe que o container está de pé,
   não que responde. Um `healthcheck` batendo em `/api/health` evita servir
   tráfego para um container ainda subindo.
3. **O assistente de IA não tem entrada em lugar nenhum.** Ele fica em
   `/contato#assistente`, mas nenhum link do site aponta para lá — nem o menu,
   nem o rodapé, nem as páginas de produto. É decisão de conteúdo, não de infra.

> Já resolvidos no repositório (estavam nesta lista): `www` sem regra no
> Traefik, HTTP sem redirect para HTTPS e o domínio fixo no build.

## Pendências de conteúdo (P1 — de `ANALISE.md`, não são de infra)

- Publicar os PDFs de catálogo em `uploads/` (os botões apontam para
  `assets/catalogos/*`, que não existe) e corrigir o `logo` do JSON-LD.
- Preencher registro ANVISA (`identifier`), CNPJ e `sameAs` no JSON-LD.
- Definir o e-mail correto (`@setfree.com.br` × `@setfree.med.br`).

---

## Atualizar o site depois

Ao reexportar do Claude Design: substitua os `.dc.html` e o `uploads/`, rode
`npm run build` local para conferir o **`19 com conteúdo · 0 avisos`**, commite
e faça o redeploy. Página nova exige entrada em `build/pages.mjs` (título e
slug) — sem isso ela não entra no `dist/` nem no sitemap.

Para levantar um ambiente de teste em outro domínio, basta o `DOMAIN` do
Dokploy — ou, localmente:

```bash
SITE_URL=https://staging.exemplo.com npm run build
```
