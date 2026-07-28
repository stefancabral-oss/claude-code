# Plano de implantação — Dokploy

Runbook de uma passada só, do zero até o site no ar em `setfree.com.br`.
Referência técnica dos serviços: `DEPLOY-DOKPLOY.md`. Estrutura do site:
`README.md`.

Sobem **dois serviços** no mesmo domínio, via um único `docker-compose.yml`:

| Serviço | O que é | Rota | Porta interna |
|---|---|---|---|
| `web` | site estático (Astro → nginx) | `setfree.com.br` | 80 |
| `api` | assistente de IA + editais do PNCP (Node) | `setfree.com.br/api/*` | 8787 |

São **38 páginas**: 19 em português na raiz e 19 em inglês sob `/en/`.

---

## Fase 0 — Antes de tocar no Dokploy

- [ ] **Os dois PRs da migração na `main`, nesta ordem:**
      [#36](https://github.com/stefancabral-oss/claude-code/pull/36) (o site em
      Astro) e depois [#37](https://github.com/stefancabral-oss/claude-code/pull/37)
      (remove o export do Claude Design). O #37 sai da branch do #36 — mergear
      fora de ordem quebra o diff.
      O deploy funciona com só o #36; o #37 é higiene de repositório.
- [ ] **Revisão das traduções em inglês** (`site/src/data/*.en.json`). São 13
      páginas de produto e solução que não tinham inglês nenhum — eu redigi.
      É texto de dispositivo médico e, uma vez no ar, o Google indexa: corrigir
      depois custa mais. **Nenhuma pessoa revisou ainda.**
- [ ] **Servidor com Docker + Dokploy instalado** e a rede `dokploy-network` já
      existente (o compose a declara como `external: true`; o Dokploy cria essa
      rede sozinho na instalação).
- [ ] **Chave da API da Claude** em mãos (`console.anthropic.com` → API keys).
- [ ] **Acesso ao DNS** de `setfree.com.br`.
- [ ] **Espaço em disco:** ~2 GB livres bastam. (Antes da migração eram ~6 GB,
      por causa da imagem do Playwright.)

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
> o build do `web`, e é dele que saem `canonical`, `hreflang`, `og:url`,
> `sitemap.xml`, `llms.txt` e o JSON-LD. Se `DOMAIN` for qualquer coisa
> diferente de `setfree.com.br`, o build se marca como não-produção e **gera um
> `robots.txt` que bloqueia todos os robôs** — de propósito, para um ambiente de
> teste não competir com o site real. Um `DOMAIN` errado aqui é a forma mais
> fácil de subir produção desindexada; confira antes do deploy.

---

## Fase 3 — Deploy

- [ ] **Deploy.** O build é `node:22-alpine` + Astro: cerca de **1 a 2 minutos**.
- [ ] **Portão de qualidade — no log do build do `web`:**

```
38 page(s) built in 1.5s
• uploads → dist/uploads (40 arquivos, 4 removidos do publicado)
```

  **38** é o número certo (19 PT + 19 EN). Menos que isso significa rota
  faltando — não promova. Os 4 removidos são o Brandbook e as capturas de tela,
  que não vão para o ar.

- [ ] Log do `api`: deve aparecer
      `assistente Setfree ouvindo em :8787 (modelo claude-sonnet-5)`.
      `ERR_MODULE_NOT_FOUND` aqui significa que o `editais.mjs` não entrou na
      imagem.
- [ ] Traefik/Let's Encrypt: confirme o cadeado no navegador. Se o certificado
      não sair, quase sempre é DNS ainda propagando ou proxy do Cloudflare ligado.

---

## Fase 4 — Verificação (rode tudo antes de anunciar)

```bash
# 1. o conteúdo está no HTML cru (sem JS)
curl -s https://setfree.com.br/tecnologias/geister | grep -o "Micro Knifes GEISTER" | head -1

# 2. título único por página
curl -s https://setfree.com.br/tecnologias/corebone | grep -i "<title>"

# 3. inglês no ar, com hreflang recíproco
curl -s https://setfree.com.br/en/technology/geister | grep -o "<title>[^<]*"
curl -s https://setfree.com.br/tecnologias/geister   | grep -o 'hreflang="en" href="[^"]*"'

# 4. navegação interna responde 200 — NÃO pode ser 301
curl -sI https://setfree.com.br/tecnologias | head -1
curl -sI https://setfree.com.br/en/about    | head -1

# 5. URL antiga do Claude Design redireciona (301) para a limpa
curl -sI https://setfree.com.br/CoreBone.dc.html | grep -i location

# 6. HTTP → HTTPS, e www → domínio raiz
curl -sI http://setfree.com.br      | grep -i "^HTTP\|^location"
curl -sI https://www.setfree.com.br | grep -i "^HTTP\|^location"

# 7. arquivos de SEO — o robots tem que estar LIBERANDO.
#    "Disallow: /" significa que o build saiu como não-produção: confira o DOMAIN.
curl -s  https://setfree.com.br/robots.txt  | head -3
curl -s  https://setfree.com.br/sitemap.xml | grep -c "<loc>"   # esperado: 38
curl -sI https://setfree.com.br/llms.txt    | head -1

# 8. assistente de IA e editais do PNCP
curl -s https://setfree.com.br/api/health
curl -s -X POST https://setfree.com.br/api/assistente \
  -H 'content-type: application/json' \
  -d '{"pergunta":"preciso de instrumental para microcirurgia oftálmica"}'
curl -s https://setfree.com.br/api/editais | head -c 200
```

No navegador:

- [ ] Home: o vídeo do hero entra por cima do poster, sem salto de layout.
- [ ] **Clicar em cada item do menu** e no rodapé — tem que ir direto, sem
      passar por redirect.
- [ ] Trocar PT/EN no topo: leva à mesma página no outro idioma (não à home).
- [ ] Contato: o assistente responde, e o botão de cotação abre o WhatsApp com a
      mensagem montada.
- [ ] Licitações: o radar do PNCP carrega os editais ao rolar até a seção.
- [ ] Testar em celular: menu hambúrguer, vídeo do hero, botão do WhatsApp.
- [ ] Console do navegador **sem erros**.

---

## Fase 5 — Pós-deploy

- [ ] Cadastrar `https://setfree.com.br/sitemap.xml` no **Google Search Console**
      e no **Bing Webmaster Tools**.
- [ ] Pedir indexação da home, de 2–3 páginas de produto **e das versões em
      inglês** — é conteúdo novo, nunca indexado.
- [ ] Conferir o consumo da API da Claude no console depois do primeiro dia.

---

## Rollback

O Dokploy guarda os deploys anteriores: **Deployments → escolher o anterior →
Redeploy**. As duas imagens são construídas do zero a cada deploy e não há banco
nem estado persistido, então o rollback é limpo. Em último caso, `git revert` do
merge e novo deploy.

---

## Ajustes recomendados (não bloqueiam o deploy)

1. **`/api/assistente` é aberto e gasta tokens.** Sem rate limit, qualquer um
   pode consumir a chave. Um middleware `rateLimit` do Traefik no router da
   `api` (ex.: 10 req/min por IP) resolve com uma linha de label.
2. **Sem healthcheck no compose.** O Traefik só sabe que o container está de pé,
   não que responde. Um `healthcheck` batendo em `/api/health` evita servir
   tráfego para um container ainda subindo.
3. **O assistente de IA não tem entrada em lugar nenhum.** Ele fica em
   `/contato#assistente`, mas nenhum link do site aponta para lá. É decisão de
   conteúdo, não de infra.
4. **As fontes ainda vêm do Google Fonts.** É a única requisição externa que
   sobrou. Auto-hospedar tira uma dependência de terceiro e melhora o LCP.

---

## Atualizar o site depois

```bash
cd site
npm install
npm run dev       # http://localhost:4321
npm run build     # confira "38 page(s) built"
```

Commite e faça o redeploy. Página nova exige rota nos dois idiomas, o caminho em
`site/src/lib/i18n.ts` e o título/description em `site/src/data/seo.*.json` —
sitemap e llms.txt se atualizam sozinhos.

Para um ambiente de teste em outro domínio, basta o `DOMAIN` do Dokploy; ou,
localmente:

```bash
SITE_URL=https://staging.exemplo.com npm run build
```
