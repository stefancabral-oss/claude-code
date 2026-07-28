# Criador de Prompt — por blocos 🧱

Uma ferramenta **interna** para montar prompts do Claude **bloco por bloco**, em vez
de escrever. Você clica em blocos — de **estrutura** (papel, contexto, objetivo,
formato…) e de **lógica/raciocínio** (SE, SENÃO, E, OU, NÃO, PARA CADA, QUANDO, passo
a passo, verifique) — que aparecem de forma **simples de ler**, e o sistema compila um
**prompt robusto e organizado**, mais rigoroso do que texto escrito à mão.

> **A ideia (definida pelo dono):** não é um lançador de tarefas prontas nem pré-seta
> nada. É um **criador de prompt** — a capacidade de **construir linha por linha**,
> usando os blocos de raciocínio lógico como peças, com uma entrega final mais robusta
> que a escrita livre.

---

## Como usar

1. Abra [`index.html`](./index.html) com **duplo clique** (abre no navegador — não
   instala nada).
2. **Clique nos blocos** à esquerda para adicioná-los à sua construção.
3. **Preencha** os campos de cada bloco (ex.: `SE [o prazo for menor que 10 dias]
   ENTÃO [marque como RISCO ALTO]`).
4. **Reordene** (↑ ↓) ou **remova** (✕) blocos à vontade.
5. O **prompt gerado** aparece embaixo em tempo real → **📋 Copiar** e cole no Claude.

Dica: clique em **✨ Carregar exemplo** para ver um prompt completo montado com blocos.

---

## Os blocos

| Estrutura | Lógica e raciocínio | Dados |
|---|---|---|
| 🎭 Papel · 📋 Contexto · 🎯 Objetivo · 📐 Formato de saída · 🧪 Exemplo · 🚫 Restrição · 🗣️ Tom | ⚖️ SE… ENTÃO · ↔️ SENÃO · ➕ E · 🔀 OU · ⛔ NÃO · 🔁 PARA CADA · 🎚️ QUANDO · 🪜 Passo a passo · ✅ Verifique | 🔌 Fonte de dados |

**O compilador organiza sozinho:** não importa a ordem em que você clica — o sistema
monta o prompt na estrutura certa (papel → contexto → objetivo → **regras de raciocínio
numeradas** → exemplos → formato → restrições → verificação). É isso que torna a
entrega "mais robusta que a escrita".

---

## Decisões do projeto (definidas com o dono)

1. **Ferramenta interna** (não é produto para vender — n=1, uso próprio).
2. **Validar o "Trilho A"** da plataforma (agendamento/execução nativos) antes de
   qualquer fase de execução automática — OK, no radar.
3. **É um criador de prompt por blocos** — pré-setar tarefas foi descartado; o valor é
   a capacidade de **construir o prompt linha por linha** com blocos de lógica legíveis.

---

## Estrutura das pastas

```
painel-comando-claude/
├── index.html             ← O CRIADOR DE PROMPT (abra com duplo clique)
├── README.md              ← você está aqui
├── IDEIA-SATURADA.md      ← o raciocínio estratégico (loop de saturação, 10 ciclos)
├── ESTRATEGIA.md          ← o plano inicial por fases
├── catalogo/
│   └── catalogo-inicial.json   ← inventário de plugins/skills/conectores instalados
├── docs/
│   └── glossario.md       ← termos em português claro
└── extras/
    └── montador-por-acao.html  ← versão anterior (lançador por ação), preservada
```

> A versão anterior (montador por ação) está preservada em `extras/` — nada se perdeu.
