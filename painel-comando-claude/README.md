# Criador de Prompt 🧱

Uma ferramenta **interna** que monta um prompt do Claude **como quem escreve uma
frase** — **uma tela por vez**, sem jogar tudo junto. Você começa escrevendo o
**objetivo seco** ("faça uma música de funk") e as telas seguintes completam o resto
da frase: estilo, detalhes, **como executar**, formato e verificação. No fim, sai um
**prompt robusto e coerente** para copiar.

> **Direção do dono:** não é formulário nem lista de opções soltas. É um **assistente
> passo a passo** que constrói o prompt na ordem certa de uma frase.

---

## 🔗 Abra no celular (link interativo)

**https://claude.ai/code/artifact/cc343b12-ff26-4e7d-ac75-7f6352fed1f7**

(É privado — só você vê. No computador também dá para abrir o `index.html` deste
repositório com duplo clique.)

---

## O passo a passo (a "gramática da frase")

Uma pergunta por tela, com **Voltar / Próximo** e barra de progresso. Passos opcionais
podem ser **pulados**.

| # | Tela | O que é |
|--:|------|---------|
| 1 | **O que você quer que seja feito?** | Texto livre, objetivo seco (obrigatório). Ex.: *"faça uma música de funk"* |
| 2 | **Com que jeito ou tom?** | Estilo/vibe (profissional, direto, animado, engraçado, detalhado) |
| 3 | **Detalhes importantes** | Palavras-chave que não podem faltar (tags) |
| 4 | **Como o Claude deve fazer isso?** | Deixar o Claude decidir · usar skill pronta · usar plugin · buscar nos apps conectados · criar skill nova |
| 5 | **Em que formato receber?** | Texto, lista, documento, planilha, mensagem pronta |
| 6 | **Quer conferir antes?** | Rascunho p/ aprovação · conferir números/nomes/datas · entregar direto |

**Exemplo do prompt montado (tudo preenchido):**

> *"Faça uma música de funk, com um tom animado e criativo, incluindo: batida animada,
> anos 2000, sobre a minha loja, do jeito que você julgar melhor. Entregue o resultado
> como texto simples, pronto para eu copiar e usar. Antes de finalizar, me mostre um
> rascunho e espere a minha aprovação."*

**Exemplo mínimo (só o objetivo, resto pulado):** *"Faça uma música de funk."*

---

## Como foi construído

Refeito com **Fable 5 + ultracode** (orquestração multiagente): um painel de design
decidiu a ordem das telas, um construtor implementou o assistente em arquivo único, e
revisores adversariais checaram UX (uma tela por vez, mobile) e bugs antes de publicar.
O raciocínio estratégico está em [`IDEIA-SATURADA.md`](./IDEIA-SATURADA.md).

## Decisões do projeto
1. **Ferramenta interna** (uso próprio, não produto para vender).
2. **Trilho A** (execução/agendamento nativo) a validar antes de qualquer automação.
3. **É um criador de prompt** — passo a passo, do objetivo seco à frase completa.

## Estrutura das pastas
```
painel-comando-claude/
├── index.html             ← O CRIADOR DE PROMPT (assistente tela-a-tela)
├── README.md              ← você está aqui
├── IDEIA-SATURADA.md      ← raciocínio estratégico (loop de saturação, 10 ciclos)
├── ESTRATEGIA.md          ← plano inicial por fases
├── catalogo/              ← inventário de plugins/skills/conectores
├── docs/glossario.md      ← termos em português claro
└── extras/                ← versões anteriores preservadas (montador e blocos)
```
