# Painel de Comando Claude 🎛️

Um painel visual para **montar prompts do Claude clicando em botões** — em vez de
escrever tudo na mão. Você escolhe uma **Skill** (o que fazer), liga um ou mais
**Conectores** (de onde vêm os dados: e-mail, Drive, Notion...) e adiciona um
**contexto** — e o painel monta o prompt pronto para você.

> **Para quem é:** pessoas que não sabem de cor quais plugins, skills e conectores
> têm instalados, e querem usar o poder do Claude sem precisar decorar comandos.

---

## O que este projeto entrega

| Fase | O que faz | Status |
|------|-----------|--------|
| **Fase 1 — Montador de prompt** | Você clica nos botões e o painel gera o texto do prompt para **copiar e colar** no Claude. Sem chave de API, sem custo. | 🟡 A construir |
| **Fase 2 — Execução real** | O painel chama a **API do Claude** sozinho e mostra a resposta ali dentro. | ⚪ Planejado |

**Decisões já tomadas** (definidas com o dono do projeto):

- 🔘 Botões: montam o prompt agora **e** vão executar de verdade depois (fase 2).
- 🌐 Onde roda: **publicado na web** (deploy, ex.: Dokploy).
- 🔒 Repositório: **privado**.

---

## Comece por aqui

👉 **Leia a estratégia completa, passo a passo:** [`ESTRATEGIA.md`](./ESTRATEGIA.md)

Esse documento explica, em linguagem simples, o que vamos construir, em que ordem,
e o que precisamos de você em cada etapa. **Nada de código foi construído ainda** —
primeiro o plano, depois a execução (como combinado).

## Estrutura das pastas

```
painel-comando-claude/
├── README.md              ← você está aqui
├── ESTRATEGIA.md          ← o plano completo, passo a passo
├── catalogo/
│   └── catalogo-inicial.json   ← lista dos seus plugins/skills/conectores (alimenta os botões)
└── docs/
    └── glossario.md       ← "o que é skill? o que é conector?" em português claro
```
