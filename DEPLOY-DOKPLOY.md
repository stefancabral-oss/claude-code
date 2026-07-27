# Deploy no Dokploy

Este repositório já vem pronto para o Dokploy (Docker + Traefik). Sobem **dois serviços** no mesmo domínio:

| Serviço | O que é | Rota |
|---|---|---|
| `web` | Site estático **pré-renderizado** (nginx) — SEO/IA leem o conteúdo | `setfree.com.br` |
| `api` | **Assistente de IA** (Node + API da Claude) — chave fica no servidor | `setfree.com.br/api/*` |

O build faz o **pré-render** (item nº 1 da análise): renderiza as 19 páginas com Chromium e grava HTML já com o conteúdo, `<title>`, `lang`, og:image e as URLs limpas. Robôs de IA (GPTBot, ClaudeBot) e o Google passam a enxergar as páginas de produto — que antes chegavam vazias.

---

## Passo a passo

1. **Suba este repositório** para o Git que o Dokploy acessa (GitHub/GitLab próprio).

2. No Dokploy: **Create → Compose**, aponte para o repositório e o `docker-compose.yml` (na raiz).

3. Em **Environment**, defina:
   ```
   DOMAIN=setfree.com.br
   ANTHROPIC_API_KEY=sk-ant-...        # sua chave da API da Claude (console.anthropic.com)
   ANTHROPIC_MODEL=claude-sonnet-5      # opcional
   ```
   > A chave fica só no servidor, nunca no HTML. Guarde como **secret** no Dokploy.

4. Aponte o **domínio** para o servidor (registro A) e deixe o Traefik do Dokploy emitir o **HTTPS** (Let's Encrypt) — os labels já estão no compose.

5. **Deploy.** O primeiro build baixa a imagem do Playwright (~1x, alguns minutos) e roda o pré-render.

---

## Testar depois do deploy

```bash
# 1) o robô sem JS agora vê conteúdo? (procure texto do produto no HTML cru)
curl -s https://setfree.com.br/tecnologias/geister | grep -o "Micro Knifes GEISTER" | head -1

# 2) título único presente?
curl -s https://setfree.com.br/tecnologias/corebone | grep -i "<title>"

# 3) URL antiga redireciona (301) para a limpa?
curl -sI https://setfree.com.br/CoreBone.dc.html | grep -i location

# 4) o assistente de IA responde?
curl -s https://setfree.com.br/api/health
curl -s -X POST https://setfree.com.br/api/assistente \
  -H 'content-type: application/json' \
  -d '{"pergunta":"preciso de instrumental para microcirurgia oftálmica"}'
```

---

## Rodar / rebuildar localmente

```bash
npm install
npm run build        # gera dist/ (pré-render das 19 páginas)
npx serve dist       # ou: python3 -m http.server -d dist 8000
```

## Ao editar o site no Claude Design

Reexporte, substitua os arquivos `.dc.html`/`uploads/` e rode `npm run build` de novo (ou só re-deploy no Dokploy — o build refaz o pré-render). O `build/pages.mjs` é onde ficam os títulos e slugs; ao **adicionar uma página nova**, inclua-a lá.

---

## O que ainda depende de você (P1 — ver `ANALISE.md`)

- Publicar os PDFs de catálogo em `uploads/` (hoje os botões apontam para `assets/catalogos/*` que não existe) e corrigir o `logo` do JSON-LD.
- Preencher no JSON-LD dos produtos o **registro ANVISA** (`identifier`), CNPJ e `sameAs` (LinkedIn/Instagram).
- Confirmar o e-mail correto (`@setfree.com.br` × `@setfree.med.br`).
- Cadastrar o `sitemap.xml` no Google Search Console e no Bing Webmaster.
