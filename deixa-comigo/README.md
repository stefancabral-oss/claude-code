# Deixa Comigo — Motor de Progressão (v2 auditada)

App de acompanhamento das **31 etapas × 5 portas (155 validações)** para tirar a
Deixa Comigo do papel até "empresa funcionando com clientes sendo atendidos" —
já com as **13 correções da auditoria de lógica** aplicadas (ver [AUDITORIA.md](AUDITORIA.md)).

## Como usar

1. Abra o `index.html` no navegador (duplo clique funciona; não precisa de servidor).
2. As etapas destravam **em ordem** — a regra de ouro é do motor, não sua: uma etapa
   só abre quando as 5 portas da anterior estão fechadas.
3. Cada porta mostra o **critério de "pronto"** (com número, quando há — F12).
4. Ao fechar uma etapa, o app dispara o **hook do Registro Vivo** (F3): perguntas e
   decisões novas são registradas na hora em que nascem.
5. As etapas **5, 22 e 26** têm o botão de **loop-back** (F1): falhou, volta de
   verdade — invalidando em cascata (F2) e contando tentativas (máx. 3).
6. O painel **Preço Canônico** (F10) é a única fonte de verdade de preço.

## Fluxo com o GitHub (roadmap)

- `roadmap.js` é a **fonte de verdade** das etapas — mudanças no método viram PR.
- O progresso fica no navegador (localStorage). Para versioná-lo no GitHub:
  **Exportar progresso** → salvar como `progress.json` na pasta → commit.
- Sugestão: cada bloco (B1–B6) pode virar um *milestone* e cada etapa uma *issue*
  usando os títulos de `roadmap.js`.

## Arquivos

| Arquivo | Papel |
|---|---|
| `index.html` | O app (single-file, sem dependências) |
| `roadmap.js` | Dados das 31 etapas × 5 portas (fonte de verdade) |
| `AUDITORIA.md` | Os 13 achados da auditoria e como cada um foi corrigido |
| `assets/logo.png` | Assinatura clínica oficial (variante Confiança + Gestão, azul claro + azul) |

## Identidade visual

O app segue a **paleta pétrea** do GTM Book v1.0 (26/07/2026), no Google Drive
(`02_Deixa_Comigo/01_MARCA_E_IDENTIDADE.docx` e `05_GO_TO_MARKET_BOOK_PETREO.docx`):

**Regra do manual: fundo sempre branco (`#FFFFFF`).** Não há modo escuro.

| Cor | Hex | Papel no app |
|---|---|---|
| Branco | `#FFFFFF` | Fundo (regra do manual) |
| Papel | `#FBF8F4` | Superfícies secundárias / áreas de respiro |
| Azul Gestão | `#132E4A` | Títulos, botões, portas |
| Azul Claro Confiança | `#3F7EA6` | Etapas concluídas |
| Terracota Afeto | `#C9603F` | Etapa atual, marcos |
| Magenta Direto | `#D6246E` | Loop-backs e alertas (urgência organizada) |
| Tinta | `#0F1720` | Texto |

Assinatura: **Assessor Executivo da Saúde** · Promessa: *"Você trata de amar. Do resto, Deixa Comigo."*

## Marcos

- **24.2** — primeira venda paga (primeiro cliente real)
- **30.5** — ciclo autônomo por 3 meses = ✅ **empresa funcionando com clientes**
