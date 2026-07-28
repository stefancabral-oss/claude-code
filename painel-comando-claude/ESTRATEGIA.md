# Estratégia — Painel de Comando Claude

> Documento de estratégia **antes da execução**. Objetivo: você entender e aprovar
> o rumo antes de escrevermos o painel. Escrito para leigos — sem jargão sem explicação.

---

## 1. O problema (em uma frase)

> "Eu tenho dezenas de plugins, skills e conectores instalados no Claude, mas **não
> sei o que tenho nem como combinar isso** para pedir as coisas certas."

Hoje, usar bem o Claude exige lembrar de comandos e escrever prompts bons. Isso é
uma barreira para quem não é técnico. **A solução é trocar a escrita por cliques.**

---

## 2. A ideia central: "prompt por botões"

Pense num **caixa eletrônico** ou no **balcão de uma lanchonete por totem**: você não
escreve nada, você **aperta botões** e no final sai o pedido pronto.

O fluxo do painel tem 4 passos, sempre iguais:

```
 [1] O QUE FAZER          [2] DE ONDE VÊM OS DADOS       [3] DETALHE          [4] RESULTADO
  (escolha uma Skill)      (ligue conectores)             (contexto livre)     (o prompt pronto)

  ┌─────────────┐          ┌───────────┐ ┌───────────┐    ┌─────────────┐      ┌──────────────┐
  │ Cobrar      │          │  Gmail    │ │  Google   │    │ "cliente X, │      │  Copiar 📋   │
  │ boleto      │  ─────▶  │  ☑ ligado │ │  Drive ☑  │ +  │  atrasado   │  ─▶  │  ou          │
  │ atrasado    │          └───────────┘ └───────────┘    │  15 dias"   │      │  Executar ▶  │
  └─────────────┘                                          └─────────────┘      └──────────────┘
```

- **Passo 1 — Skill (o "verbo"):** o que você quer fazer. Ex.: *"cobrar boleto",
  *"resumir e-mails do dia"*, *"analisar edital"*, *"criar post"*.
- **Passo 2 — Conectores (a "fonte"):** de onde o Claude tira a informação. Ex.:
  Gmail, Google Drive, Notion, Outlook. Você liga/desliga com um toque.
- **Passo 3 — Contexto (o "tempero"):** um campo curto para detalhes ("cliente
  Fulano", "mês de julho"). Opcional.
- **Passo 4 — Resultado:** o painel monta o prompt. Na **Fase 1** você **copia**;
  na **Fase 2** você aperta **Executar** e a resposta aparece na tela.

**Por que isso funciona:** cada botão carrega, escondido, um pedaço de prompt bem
escrito. Você só escolhe as peças; o painel escreve o prompt profissional por você.

---

## 3. As três peças que viram botões

O painel organiza tudo que você tem em **três famílias de botões**. Entender a
diferença é o que destrava o projeto:

| Família | O que é, em português claro | Exemplos que você já tem |
|---------|-----------------------------|--------------------------|
| **Skills** | Uma "receita" que ensina o Claude a fazer **uma tarefa** bem feita. | Analisar editais Setfree, triagem de e-mails, cobrar fatura, resumir reunião |
| **Plugins** | Um "pacote" que traz várias skills + comandos de um mesmo tema. | `small-business`, `licitacao-setfree`, `finance`, `marketing`, `legal` |
| **Conectores (MCP/API)** | A "tomada" que liga o Claude a um app externo para ler/escrever dados. | Gmail, Google Drive/Agenda, Microsoft 365, Notion, Canva, Figma, GitHub |

> A lista **real** do que está instalado na sua conta está em
> [`catalogo/catalogo-inicial.json`](./catalogo/catalogo-inicial.json). Esse arquivo é
> o "cérebro" do painel: **os botões são gerados a partir dele**. Mudou o catálogo →
> mudam os botões, sem reprogramar nada.

---

## 4. Como o painel é feito por dentro (arquitetura simples)

Dois pedaços, como um restaurante:

```
   NAVEGADOR (o salão)                        SERVIDOR (a cozinha)
 ┌───────────────────────┐   internet    ┌─────────────────────────────┐
 │  FRONT-END            │  ◀─────────▶  │  BACK-END                   │
 │  - mostra os botões   │   (pedidos)   │  - guarda o catálogo        │
 │  - monta o prompt     │               │  - monta/valida o prompt    │
 │  - botão Copiar       │               │  - (Fase 2) chama a API do  │
 │  - (Fase 2) Executar  │               │    Claude com segurança     │
 └───────────────────────┘               └─────────────────────────────┘
```

- **Front-end (o que você vê):** a tela com botões. Feita para ser bonita e óbvia.
- **Back-end (o que você não vê):** guarda a lista de skills/conectores e, na Fase 2,
  é quem conversa com o Claude. **A chave de API fica só aqui, nunca no navegador**
  (isso é segurança — a chave é como a senha do cartão).

**Stack recomendada** (ferramentas escolhidas por serem simples e fáceis de publicar):

- Front-end: **HTML + Tailwind CSS + um pouco de JavaScript** (ou React se crescer).
- Back-end: **Node.js** com um servidor leve (Express/Fastify).
- Publicação: **Docker + Dokploy** — o mesmo esquema que você já usa neste projeto.
- Catálogo: um arquivo **JSON** (nada de banco de dados na Fase 1).

---

## 5. Roadmap — passo a passo por fases

> Cada fase termina em algo que **funciona e dá para ver**. Você aprova antes da próxima.

### 🟢 Fase 0 — Fundação (a que estamos concluindo agora)
1. Definir o conceito (feito).
2. Criar o repositório/pasta do projeto (feito).
3. Escrever esta estratégia e o glossário (feito).
4. Levantar o catálogo inicial do que você tem instalado (feito — `catalogo-inicial.json`).
- **Entrega:** este plano, para você ler e aprovar. ✅

### 🟡 Fase 1 — Montador de prompt (o MVP que já é útil)
1. Tela única com as 3 famílias de botões, lidas do catálogo.
2. Lógica que junta as peças e escreve o prompt.
3. Botão **Copiar** e uma pré-visualização do prompt.
4. Deixar bonito e responsivo (funciona no celular).
5. Publicar na web (Dokploy) com link privado.
- **Entrega:** um site onde você clica e sai o prompt pronto para colar no Claude.
- **Sem** chave de API, **sem** custo de uso, **sem** risco.

### 🔵 Fase 2 — Execução de verdade
1. Criar o back-end que guarda a chave de API com segurança.
2. Botão **Executar**: manda o prompt e mostra a resposta na tela.
3. Histórico dos últimos comandos.
4. Controle de custo (mostrar/limitar gasto por execução).
- **Entrega:** o painel deixa de só montar e passa a **fazer**.
- **Precisa de:** uma chave de API do Claude (paga por uso) e cuidados de segurança.

### 🟣 Fase 3 — Refino (opcional, conforme o uso)
1. Favoritos e "combos" salvos (ex.: "Manhã de licitações" com 1 clique).
2. Perfis por área (Financeiro, Comercial, Licitações...).
3. Login para a equipe usar.
4. Conectar de fato os apps externos (ações que leem/escrevem no Gmail, Drive etc.).

---

## 6. Escopo do MVP (o que entra e o que NÃO entra na Fase 1)

**Entra:**
- ✅ Botões de Skills, Plugins e Conectores vindos do catálogo.
- ✅ Montagem do prompt + pré-visualização + botão Copiar.
- ✅ Visual limpo, em português, funcionando no celular.
- ✅ Publicado num link privado.

**NÃO entra (fica para depois):**
- ❌ Executar o prompt sozinho (isso é a Fase 2).
- ❌ Login/usuários.
- ❌ Ler/escrever de verdade no Gmail, Drive etc.
- ❌ Banco de dados.

> Manter o MVP pequeno é de propósito: você tem algo útil **rápido**, e a gente
> cresce em cima do que já funciona.

---

## 7. O catálogo que alimenta os botões (modelo de dados)

Cada item do catálogo é um "cartão" com o texto de prompt escondido dentro. Exemplo:

```json
{
  "id": "cobrar-fatura",
  "familia": "skill",
  "rotulo": "Cobrar fatura atrasada",
  "descricao": "Escreve uma cobrança educada com base no histórico do cliente.",
  "icone": "💰",
  "trecho_prompt": "Escreva uma cobrança cordial e firme para o cliente {contexto}, considerando o histórico de pagamentos.",
  "conectores_sugeridos": ["gmail", "google-drive"]
}
```

- `familia`: `skill`, `plugin` ou `conector`.
- `trecho_prompt`: o pedaço de prompt que esse botão adiciona.
- `{contexto}`: onde entra o que você digitar no passo 3.
- `conectores_sugeridos`: o painel já acende as tomadas certas para você.

Trocar/adicionar botões = editar esse arquivo. **Nenhuma reprogramação.**

---

## 8. Riscos e cuidados (o que precisamos vigiar)

| Risco | Cuidado que vamos tomar |
|-------|-------------------------|
| **Chave de API vazar** (Fase 2) | A chave fica só no servidor, nunca no navegador; nunca vai para o GitHub. |
| **Custo surpresa** (Fase 2) | Mostrar o gasto estimado e permitir limite por execução. |
| **Dados sensíveis** (clientes, e-mails) | Repositório privado; conectores só ligados quando você mandar. |
| **Catálogo desatualizado** | Uma rotina simples para reler o que está instalado e atualizar o JSON. |
| **Complexidade demais** | Regra de ouro: Fase 1 tem que ser burra e óbvia. Poder vem depois. |

---

## 9. O que eu preciso de você para começar a Fase 1

1. **Aprovar esta estratégia** (ou pedir ajustes). ✅/✏️
2. Confirmar o **visual**: tem uma identidade/cores da sua empresa (Setfree) que
   você quer usar? (Se não, eu escolho um visual limpo e neutro.)
3. Dizer **quais 6 a 10 skills** você mais usa no dia a dia, para eu já deixá-las
   como os primeiros botões (ex.: analisar edital, triagem de e-mails, cobrar
   fatura, resumo de reunião...). Se preferir, eu sugiro uma lista inicial.
4. Sobre o **repositório próprio**: hoje a permissão da sessão não deixa criar um
   repo novo automaticamente. Quando você quiser um repo separado, dá para (a) você
   criar o repo vazio no GitHub e eu envio o código, ou (b) ampliar a permissão do
   app. Por enquanto o projeto vive nesta pasta, isolado e pronto para mudar de casa.

> **Assim que você aprovar, eu começo a Fase 1** e te entrego o painel montador de
> prompt publicado num link privado.
