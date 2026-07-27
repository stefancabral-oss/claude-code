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

## Estado atual

Site **renderizado no cliente** (JavaScript). SEO on-page e JSON-LD já embutidos por página.
Ver `ANALISE.md` na raiz para a auditoria completa e o plano de mudanças (SEO, IA e conteúdo dinâmico).

## Rodar localmente

```bash
python3 -m http.server 8000
# abra http://localhost:8000/Home.dc.html
```
