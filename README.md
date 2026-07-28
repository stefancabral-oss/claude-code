# Setfree — Site institucional

Site da **Setfree** (importação e distribuição de tecnologia médica de padrão
internacional — dispositivos regenerativos e minimamente invasivos, Cotia-SP).

Construído em **Astro**: cada página sai do build como HTML estático, em
**português e inglês**.

## Estrutura

| Caminho | Conteúdo |
|---|---|
| `site/` | O site (Astro). É aqui que se trabalha. |
| `site/src/pages/` | Rotas. `/` em português, `/en/` em inglês. |
| `site/src/paginas/` | As 6 páginas próprias, cada uma servindo os dois idiomas. |
| `site/src/layouts/` | `Base` (head/SEO), `LinhaPage` (produto), `SolucaoPage` (solução). |
| `site/src/components/` | `SiteNav`, `SiteFooter`, `EditaisPncp`. |
| `site/src/data/` | Conteúdo das 7 linhas e 6 soluções, em `.pt.json` + `.en.json`. |
| `site/src/lib/` | `i18n.ts` (rotas e strings), `seo.ts` (título, description, JSON-LD). |
| `uploads/` | Imagens, vídeo do hero, catálogos em PDF e o Brandbook. |
| `api/` | Serviço de IA: `/api/assistente` e `/api/editais` (PNCP). |
| `deploy/` + `docker-compose.yml` | nginx e Traefik para o Dokploy. |

Os arquivos `.dc.html` e o `support.js` na raiz são o **export original do
Claude Design**, mantidos para comparação durante a revisão da migração. Não
alimentam mais o site publicado.

## Rodar

```bash
cd site
npm install
npm run dev       # http://localhost:4321
npm run build     # → site/dist (38 páginas + uploads)
npm run preview
```

O domínio do build vem de `SITE_URL` (padrão: produção). Em qualquer outro
domínio, o `robots.txt` gerado bloqueia os robôs:

```bash
SITE_URL=https://staging.exemplo.com npm run build
```

## Idiomas

Cada página existe nas duas línguas, com `hreflang` recíproco:

| Português | Inglês |
|---|---|
| `/tecnologias/geister` | `/en/technology/geister` |
| `/solucoes/licitacoes` | `/en/solutions/licitacoes` |
| `/sobre` | `/en/about` |

O conteúdo de produto e solução vive em `site/src/data/*.pt.json` e
`*.en.json`; o build falha se as listas saírem de sincronia. O texto das
páginas próprias fica no ponto de uso, via `L(lang, "…", "…")`.

Ao adicionar uma página: crie a rota nos dois idiomas, registre o caminho em
`site/src/lib/i18n.ts` e o título/description em `site/src/data/seo.*.json`.
Sitemap e llms.txt se atualizam sozinhos.

## Documentos

- **`ANALISE.md`** — auditoria de SEO, IA e performance do site anterior.
- **`PLANO-IMPLANTACAO.md`** — runbook de deploy no Dokploy.
- **`DEPLOY-DOKPLOY.md`** — referência dos dois serviços (`web` e `api`).
