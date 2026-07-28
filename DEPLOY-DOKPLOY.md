# Deploy no Dokploy — referência dos serviços

Para o passo a passo do deploy, use o **`PLANO-IMPLANTACAO.md`**. Este arquivo
descreve o que sobe e por quê.

Sobem **dois serviços** no mesmo domínio:

| Serviço | O que é | Rota | Porta |
|---|---|---|---|
| `web` | site estático (Astro → nginx) | `setfree.com.br` | 80 |
| `api` | assistente de IA + editais do PNCP (Node) | `setfree.com.br/api/*` | 8787 |

## `web`

`deploy/Dockerfile.web`, dois estágios:

1. **build** — `node:22-alpine`, `npm ci` e `astro build`. Gera as 38 páginas
   (19 em português, 19 em inglês) e copia `uploads/` para o `dist/`.
2. **runtime** — `nginx:1.27-alpine` com apenas o `dist/` e o `deploy/nginx.conf`.
   Sem Node, sem `node_modules`: a imagem final tem ~67 MB.

O `nginx.conf` cuida das URLs limpas (`try_files` serve o `index.html` direto,
sem 301), do cache dos assets, dos headers de segurança e do 301 das URLs
antigas `*.dc.html` para as limpas.

### `SITE_URL`

O compose passa `SITE_URL=https://${DOMAIN}` como build arg. É desse valor que
saem `canonical`, `hreflang`, `og:url`, `sitemap.xml`, `llms.txt` e o JSON-LD.

Quando `SITE_URL` **não** é `https://setfree.com.br`, o build se marca como
não-produção e o `robots.txt` gerado bloqueia todos os robôs — proteção para que
um ambiente de teste não vire conteúdo duplicado do site real.

## `api`

`api/Dockerfile`, `node:22-alpine` sem dependências (usa `http` e `fetch`
nativos). Duas rotas além do `/api/health`:

- `POST /api/assistente` — repassa a pergunta para a API da Claude com um
  system prompt que fixa o portfólio e os números de registro ANVISA, e proíbe
  falar de preço. A chave fica só no servidor.
- `GET /api/editais` — consulta o PNCP e devolve os pregões de saúde abertos.

O router da `api` tem `priority=100` no Traefik para capturar `/api/*` antes do
site.

## Variáveis

```
DOMAIN=setfree.com.br            # obrigatória — manda no roteamento e no build
ANTHROPIC_API_KEY=sk-ant-...     # obrigatória — guarde como secret
ANTHROPIC_MODEL=claude-sonnet-5  # opcional
```

## Rodar local

```bash
cd site && npm install && npm run dev     # http://localhost:4321
```

Para exercitar a imagem de verdade (nginx, redirects, cache):

```bash
podman build -f deploy/Dockerfile.web -t setfree-web .
podman run --rm -p 8080:80 setfree-web
```

O assistente e os editais só respondem com o serviço `api` no ar — sem ele, o
site degrada com elegância (mensagem apontando para o WhatsApp).
