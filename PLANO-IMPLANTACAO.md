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

> **Atenção — `www` não está coberto.** O `docker-compose.yml` só tem
> `Host(\`${DOMAIN}\`)`. Com o A de `www` apontando para o servidor mas sem
> regra no Traefik, `www.setfree.com.br` cai em 404. Ver "Ajustes recomendados"
> no fim.

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

---

## Fase 3 — Deploy

- [ ] **Deploy.** O primeiro build baixa a imagem do Playwright e roda o
      pré-render das 19 páginas com Chromium — conte **5 a 15 minutos**. Os
      seguintes são bem mais rápidos (cache de camadas).
- [ ] **Acompanhe o log do build do `web` e procure a última linha do
      pré-render.** Ela é o portão de qualidade:

```
✔ 19 páginas · 19 com conteúdo · 0 avisos → dist/
```

  Se vier `0 com conteúdo · 19 avisos`, **não promova**: o site sobe sem o HTML
  que Google e robôs de IA leem. Foi exatamente o bug corrigido em `09a7e1b`
  (o Babel do unpkg era stubado no pré-render e nada renderizava).

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

# 6. arquivos de SEO na raiz
curl -sI https://setfree.com.br/robots.txt  | head -1
curl -sI https://setfree.com.br/sitemap.xml | head -1
curl -sI https://setfree.com.br/llms.txt    | head -1

# 7. o React e o Babel carregam do próprio domínio (sem unpkg)
curl -sI https://setfree.com.br/vendor/react.production.min.js | head -1
curl -sI https://setfree.com.br/vendor/babel.min.js            | head -1
```

- [ ] No navegador: abrir a home, o console **sem erros de `integrity`**
      (bloqueio de SRI = bundle do `build/vendor/` com bytes errados).
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

Nenhum destes impede o site de subir, mas os dois primeiros afetam usuário real
no primeiro dia:

1. **`www` não responde.** Adicionar ao router do `web` no compose:
   `Host(\`${DOMAIN}\`) || Host(\`www.${DOMAIN}\`)` — e o mesmo no da `api`.
2. **HTTP não redireciona para HTTPS.** Os routers só declaram o entrypoint
   `websecure`. Se o Dokploy não tiver o redirect global ligado, quem digitar
   `setfree.com.br` sem `https://` não chega ao site. Confirme na instalação ou
   adicione um router no entrypoint `web` com o middleware `redirect-to-https`.
3. **`/api/assistente` é aberto e gasta tokens.** Sem rate limit, qualquer um
   pode consumir a chave. Um middleware `rateLimit` do Traefik no router da
   `api` (ex.: 10 req/min por IP) resolve com uma linha de label.
4. **Domínio fixo no build.** `build/pages.mjs` tem
   `SITE = "https://setfree.com.br"` e o `seo/` também. Se você subir um
   ambiente de staging em outro domínio, os `canonical`, o `sitemap.xml` e o
   JSON-LD vão apontar para produção — e o Google pode indexar errado. Para
   staging, mude o `SITE` **e** bloqueie tudo no `robots.txt`.
5. **Sem healthcheck no compose.** O Traefik só sabe que o container está de pé,
   não que responde. Um `healthcheck` batendo em `/api/health` evita servir
   tráfego para um container ainda subindo.

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
