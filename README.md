# Setfree — Site institucional

Novo site da **Setfree** (importação e distribuição de tecnologia médica de padrão internacional — dispositivos regenerativos e minimamente invasivos, Cotia-SP).

Exportado do **Claude Design** (formato `.dc.html` + runtime `support.js`, React 18 via CDN).

## Estrutura

| Caminho | Conteúdo |
|---|---|
| `Home.dc.html` | Página inicial |
| `Tecnologias.dc.html`, `Solucoes.dc.html`, `Sobre.dc.html`, `Contato.dc.html`, `NossaEsperanca.dc.html` | Páginas principais |
| `Geister/Radimed/MarrowCellution/CoreBone/Lipsus/Dentsply/ParceirosEstrategicos.dc.html` | 7 linhas de produto |
| `Licitacoes/RegistroAnvisa/Sourcing/EntradaMercado/ConsultoriaComercial/Qualidade.dc.html` | 6 soluções |
| `LinhaPage.dc.html`, `SolucaoPage.dc.html` | Templates reutilizáveis (produto / solução) |
| `SiteNav.dc.html`, `SiteFooter.dc.html` | Componentes de navegação e rodapé |
| `mapa-brasil.html` | Mapa interativo de presença nacional |
| `support.js` | Runtime do Claude Design (renderização client-side) |
| `uploads/` | Imagens, vídeo do hero e o Brandbook v3 |
| `seo/` | `robots.txt`, `sitemap.xml`, `llms.txt` e guia de SEO/GEO |

## Documentos

- **`ANALISE.md`** — auditoria completa (SEO, IA, performance) e plano de mudanças.
- **`DEPLOY-DOKPLOY.md`** — como publicar no Dokploy (build + deploy).

## Build e deploy

O site é pré-renderizado para HTML indexável (robôs de IA/Google passam a ler as páginas de produto) e sobe no Dokploy com um serviço de IA real.

```bash
npm install
npm run build        # pré-render → dist/ (19 páginas com <title>, JSON-LD no <head>, URLs limpas)
python3 -m http.server -d dist 8000
```

- `build/prerender.mjs` — pipeline de pré-render · `build/pages.mjs` — títulos e slugs.
- `api/` — endpoint `/api/assistente` (assistente de IA).
- `deploy/` + `docker-compose.yml` — nginx (URLs limpas + 301) e Traefik para o Dokploy.

### Editar direto (Claude Design)

```bash
python3 -m http.server 8000   # abra http://localhost:8000/Home.dc.html
```
