# Ideia Saturada — Compositor de Comando Claude

> Resultado de um **loop de saturação de ideia** (ciclos Crítico → Autor → Juiz, em
> contexto independente). Ponto de partida: o painel de 4 etapas. Pergunta do dono:
> *"sinto que tem mais de 4 etapas — modelo pelo que faz, superfície, o que retorna,
> onde salvar, quais conectores"*. Este documento é a **versão mais completa** a que
> a ideia chegou depois de ser furada 7+ vezes por críticos adversariais.

---

## 1. O que a ideia virou (resumo em uma frase)

> Um **painel que transforma as capacidades que você JÁ tem instaladas no Claude
> (skills, plugins, conectores) em botões**, que primeiro **montam** um comando bem
> feito (Fase 1) e depois, nas tarefas que provarem valor, **agendam e executam**
> esse comando sozinhos (Fase 2) — com trilhos de segurança para não errar caro num
> negócio regulado.

A grande virada do loop: **não são "mais etapas".** O usuário toma **1 decisão** (a
ação); as outras dimensões são **inferidas e mostradas como um recibo editável**,
cada campo já com "usar o recomendado". Mais poder, sem mais trabalho.

---

## 2. As dimensões que você pediu — resolvidas (sem virar formulário)

Você estava certo: um bom comando tem mais que 4 dimensões. O loop mostrou **como
incluí-las sem afogar o leigo** — todas inferidas por uma "receita", editáveis, com
default:

| Dimensão que você citou | Como entra no painel (sem virar etapa obrigatória) |
|---|---|
| **Modelo pelo que faz** | "Como o Claude deve pensar?" → ⚡ Rápido · 🧠 Profundo · 👁️ Com imagem. Inferido da ação. |
| **Superfície (chat/cowork/design/code)** | **Some da tela** — jargão. É derivada internamente a partir de "o que você quer de volta?". |
| **O que deve retornar** | "O que você quer de volta?" → resposta na tela · documento/PDF · planilha · arte · código. |
| **Qual pasta salvar** | Só aparece se o retorno for arquivo **e** houver conector de armazenamento ligado. Default: "só me mostrar". |
| **Quais conectores** | Sugeridos já acesos pela receita, opt-in, com "por quê" + nota de privacidade. |

---

## 3. Como funciona (fluxo final)

1. **Escolher a ação** — botões curados por vertical + **Combos de 1 clique**.
   Variantes comuns são botões distintos ("Analisar edital → *parecer go/no-go*" ≠
   "→ *planilha de itens*"), então você já escolhe na forma que quer.
2. **Cartão do Comando** — pré-preenchido por uma **receita** (1 arquivo declarativo
   por ação). Campos em linguagem leiga, cada um com "usar o recomendado".
3. **O que esperar / O que conferir** — checklist do resultado previsto. Em tarefas
   de alto risco, vira uma lista de **verificação factual** ("confira o valor da
   proposta, a data da sessão, os requisitos de habilitação").
4. **Resultado** — prompt 100% visível + **Copiar** (Fase 1). Nas receitas
   vencedoras: **agendar/executar** (Fase 2) com "deu certo?" + link + log.

---

## 4. O motor (o que impede virar um inferno de regras)

- **Cada ação = 1 receita declarativa** (como as skills já são): defaults + **lista
  branca** de opções válidas + template de prompt com lacunas. Nova ação = 1 arquivo.
- **Modelo e conectores em 2 mapas centrais** ("função→modelo", "conector→como"):
  trocar de modelo/preço = editar **1 lugar**, não N ações.
- **Combinações sem sentido são impossíveis** (lista branca da receita).
- **Defaults determinísticos** — nada de LLM adivinhando em tempo de uso. O Claude só
  ajuda a *criar* a receita, revisada por um humano.

---

## 5. Confiança e segurança (o que trava erro caro num negócio regulado)

- **Gate de criticidade:** cada receita é **baixa** (arte, rascunho) ou **alta** (vai
  pra fora / vale dinheiro / é irreversível). Alta criticidade **nunca envia sozinha**
  — força revisão humana + checklist factual.
- **Agendável ⟹ só baixa/média criticidade, e sempre em rascunho.** A rotina
  **prepara** o trabalho e te espera; não submete alto risco.
- **Re-gate no momento do disparo:** se a criticidade de uma receita agendada
  **subiu** desde o agendamento (por gatilho de contexto — valor do certame,
  exposição fiscal, envio externo), a execução **degrada sozinha para lembrete + 1
  clique** e força humano-no-loop. (Fecha o único furo pelo qual uma rotina rodaria
  acima do próprio gate.)
- **Contra erro silencioso:** golden output (saída-âncora) + **humano-no-loop** como
  backstop em alta criticidade.
- **Degradação graciosa:** sem conector/pasta, ainda entrega o conteúdo na tela.
- **Log de decisão** (não só de execução): ação, receita+versão, defaults aceitos vs.
  alterados, quem rodou, criticidade, quem assinou.

---

## 6. Fase 2 sem apostar num endpoint mágico (escada de trilhos)

A execução recorrente **não depende** de uma API não confirmada. Ordem do disponível
hoje ao upside:

- **Trilho A** *(provável hoje)*: handoff do comando para o **Claude nativo** (onde os
  conectores já funcionam) + **agendamento pelas Rotinas da própria plataforma**.
  Monitorado continuamente; se degradar, cai para lembrete + 1 clique.
- **Trilho B**: execução via **API + MCP** onde houver.
- **Trilho C**: **modo copiar** (sempre funciona).
- **Gate obrigatório:** *validar na documentação real qual trilho existe **antes** de
  escrever a Fase 2.* Execução programática pura é **upside, não pré-requisito**.

---

## 7. Economia e posicionamento (as respostas honestas)

- **Cold start resolvido:** a biblioteca inicial é **envelopar as skills que a Setfree
  já usa** (`analise-editais`, `triagem-emails`, `cockpit`, `small-business`…) →
  poucos dias, sem content-ops eterno. O painel é um **lançador sobre ativos que já
  existem** — que é exatamente o "mapa de capacidades".
- **Dois modos de cliente:** **Solo** (o gancho é *execução desassistida* + checklist
  como controle; sem 2ª assinatura de mentira) e **Equipe** (governança vale). O
  produto pergunta o modo — não vende "governança de equipe" para quem não tem equipe.
- **Retenção mora na Fase 2** (execução com dados frescos + agendamento + histórico),
  não em copiar prompt. Fase 1 é **cunha** para descobrir quais receitas são usadas.
- **Dois produtos nomeados:** *"Descobridor + Montador"* (Fase 1) e *"Rotinas que
  trabalham por você"* (Fase 2). Engenharia **mínima no invólucro, máxima no conteúdo**.
- **Fosso = conteúdo vertical BR** (checklists de edital, PNCP, defaults fiscais
  ME/EPP + Lucro Real) + **dado proprietário de uso** — nicho local e pequeno demais
  para uma plataforma horizontal priorizar. **Limiar mensurável:** N receitas ativas
  com "deu certo?" ≥X% cobrindo ≥Y% das tarefas recorrentes `[declarado — calibrar]`
  = ponto em que trocar dói. A **portabilidade da arquitetura** é seguro contra troca
  de plataforma, não fonte de fosso.
- **Produto-ponte:** critério de saída por **gatilho** (a plataforma lançar mapa de
  capacidades nativo + montagem guiada), não por data. Plano B: o ativo migra para
  governança/curadoria ou automação/agendamento que o nativo não prioriza.

---

## 8. Métricas (hipóteses a calibrar)

`[declarado — calibrar]` — nenhum número foi medido; são hipóteses de partida:

- **Adoção:** comandos/semana por usuário (saúde ≥3).
- **Saúde da receita:** taxa de "deu certo?" ≥80% (abaixo → revisão/aposentadoria).
- **Biblioteca viva:** nº de receitas usadas nos últimos 30 dias (vs. botões-zumbi).
- **ROI:** tempo economizado por execução.
- **Defensabilidade:** massa crítica de fosso (item 7).

---

## 9. Filtro de entrada (o que merece virar botão)

Entra na biblioteca só a tarefa **repetível + com conector + de valor médio/alto** —
concretamente: feita **≥X×/mês por ≥2 pessoas OU que custa ≥Y min**
`[declarado — calibrar]`, e de forma estável. O painel **não compete no fácil**:
tarefa simples → ele mesmo sugere "abre o Claude e digita".

---

## 10. Tabela de evolução do loop

| Ciclo | ALTA | MÉDIA | MARGINAL | Juiz | Principal avanço |
|------:|:----:|:-----:|:--------:|:----:|------------------|
| 1 | 11 | 10 | 3 | melhor* | Reframe: 1 decisão + 6 inferidas; unifica entregável/superfície; transparência |
| 2 | 5 | 5 | 3 | melhor* | Motor de receitas declarativas; remove jargão; camada de verificação; posicionamento honesto |
| 3 | 3 | 4 | 2 | MELHOR | Autoria de receita em 3 níveis + dono; gate de criticidade; métricas; log de decisão |
| 4 | 4 | 5 | 2 | MELHOR | Biblioteca = envelopar skills; especialista assina fatia crítica; retenção na Fase 2; sem custódia própria |
| 5 | 1 | 7 | 3 | MELHOR | Escada de trilhos da Fase 2 + gate de validação; agendável só rascunho; modos Solo/Equipe |
| 6 | 0 | 4 | 5 | MELHOR | Defesa do fosso vs plataforma-mãe + limiar mensurável; degradação contínua; criticidade por gatilho |
| 7 | 0 | 1 | 10 | MELHOR | Re-gate de criticidade no momento do disparo (fecha janela TOCTOU) |
| 8 | 0 | 1 | 6 | MELHOR | Fase 2 reescopada: "prepara seu trabalho" (coleta/pré-organiza), não decide |
| 9 | 0 | 1 | 4 | (junto) | Criticidade lida no OUTPUT (não na receita); teto de segurança no modo Solo |
| 10 | 1 | 2 | 3 | MELHOR | Identidade decidida: ferramenta interna 1º; gate na entrada; vs incumbentes |

\* Ciclos 1–2: o token do juiz veio invertido, mas a justificativa afirmava avanço material. Curva de ALTA: **11 → 5 → 3 → 4 → 1 → 0 → 0 → 0 → 0 → 1**. A ALTA que reapareceu no ciclo 10 **não é de design — é uma decisão de negócio** (ferramenta vs. produto), resolvida na V9 pela escolha "ferramenta interna primeiro".

---

## 11. Sugestões MARGINAIS rejeitadas (para você decidir se resgata)

Não entraram porque são acabamento, não estrutura — mas ficam registradas:

- **Nome "Compositor de Comando":** "Comando" antecipa a Fase 2 (execução) antes de
  ela existir; pode criar expectativa. Rever naming.
- **Campo "dono" no modo Solo** é redundante (sempre a mesma pessoa) — esconder na UI Solo.
- **Régua de "contexto curto"** — sem limite claro; dar exemplos por ação.
- **Busca de ações** pressupõe que o leigo sabe nomear o que quer; a navegação por
  objetivo/vertical é o caminho primário para o leigo.
- **Golden output envelhece** em extração sobre documentos heterogêneos (cada edital
  é diferente) — precisa de tolerância/similaridade, não igualdade exata.
- **Self-approval no modo Solo:** o humano-no-loop com 1 humano é ponto único de
  julgamento — aceito por design no Solo, mas explicitado.
- **Custo de sincronizar o mapa de capacidades** quando a plataforma renomeia/remove
  skills — custo de curadoria recorrente, atribuir ao dono da receita.
- **Empilhamento de custo:** a taxa do produto senta sobre o custo de tokens, que
  cresce com a automação — tensão de precificação a resolver.
- **Admissibilidade legal do log** (ANVISA/regulado): prova defensável pede
  tamper-evidence + assinatura eletrônica válida — hardening do log existente.
- **Quais verticais jamais rodam autônomos** — decisão de go-to-market.

---

## 12. As duas coisas a decidir antes de codar (do próprio loop)

1. **Validar o Trilho A** contra a documentação real da plataforma — existe
   agendamento/handoff nativo disparável? Isso destrava (ou reconcebe) a Fase 2 inteira.
2. **O cliente tem equipe?** Se for o Stefan sozinho, o gancho é *execução
   confiável desassistida*, não *governança de equipe*.

---

## 13. Ciclos tardios (8–10) — o que mudou e a decisão de identidade

Depois do ciclo 6 as falhas de **design** zeraram e não voltaram. Os ciclos 8–10
pararam de achar buracos de mecanismo e passaram a achar **decisões estratégicas**:

**V8 (ciclo 8) — a Fase 2 foi reescopada honestamente.** Sob todos os gates de
segurança, "executa seu trabalho" era exagero: o que sobra é **rascunho que um humano
revisa**, e a revisão é a parte cara. Então a Fase 2 vira **"Rotinas que PREPARAM seu
trabalho"** — o que ela remove é o **toil de coleta + normalização + pré-organização
de dados frescos** (puxar editais novos do PNCP, ler a caixa, montar o cockpit), não o
julgamento. Retenção = eliminar esse toil (um prompt copiado não faz), não decidir por você.

**V9 (ciclo 9) — criticidade é do OUTPUT, não da receita.** Depois de gerar o rascunho,
um classificador lê o **próprio rascunho/insumo** (tem valor a submeter? envio externo?
prazo? cláusula de responsabilidade?) e eleva **aquela instância**. Regra à prova de
falha (ver abaixo). Teto no modo Solo: com 1 humano não há verificação independente,
então **nada irreversível / externo / que gasta dinheiro é automatizado**.

**V9 (ciclo 10) — a decisão de identidade que dois críticos independentes exigiram:**

> **Isto é, primeiro, uma FERRAMENTA INTERNA da Setfree (n=1). "Produto para vender"
> é uma aposta separada, adiada e com gate próprio — não é o que estamos construindo agora.**

Isso **colapsa** a contradição ponte-vs-fosso: como ferramenta interna, **não precisa de
fosso** — precisa de **ROI operacional** (menos tempo, menos erro, menos dependência de
uma só pessoa). Todo o aparato "fosso competitivo / massa crítica / defesa contra a
plataforma-mãe" sai do caminho crítico e vira **apêndice condicional**: só volta a valer
SE a ferramenta provar valor interno E alguém assumir as competências de produto (GTM,
curadoria em escala, vendas) — que são **outra empresa**. A Setfree é distribuidora de
dispositivos médicos, não SaaS: o *founder-market-fit* para o caminho produto é fraco, e
por isso o default honesto é **ferramenta interna, ponto**.

Mais duas correções do ciclo 10:

- **Gate movido para a ENTRADA (proveniência):** a coleta **carimba origem + data** de
  cada dado e **sinaliza dado velho / faltante / de fonte não-confiável** *antes* de
  pré-organizar. O rascunho mostra **de onde veio cada coisa**. Contra o viés de
  ancoragem, o rascunho de alta criticidade vem com os **pontos de decisão em aberto**
  e as fontes ao lado — força **decidir**, não **carimbar**.
- **Os dois guardas de segurança, reconciliados:** o humano-no-loop é o **default**; o
  classificador de criticidade **só pode ROUTAR PARA CIMA, nunca conceder segurança**.
  Apenas saídas que batem com um **padrão explicitamente declarado como seguro na
  receita** ("auto-ok") pulam a revisão; todo o resto vai para o humano. Assim o modo de
  falha perigoso (classificação **confiante-e-errada** rebaixando algo crítico) fica
  **impossível por construção** — a IA pode adicionar cautela, nunca removê-la.
- **Incumbentes (Effecti, Publicnet…):** como ferramenta interna, não precisa vencê-los
  no mercado — ela **orquestra os ativos de IA que a Setfree já montou** (go/no-go,
  cotação, cockpit) e que os incumbentes de coleta/gestão **não** oferecem. Se um dia
  virar produto, o wedge é a **camada de decisão por IA sobre** a coleta que eles já
  dominam — complemento, não substituto.

---

## 14. Declaração de parada (honesta)

**INTERROMPIDO no ciclo 10 — NÃO formalmente saturado** (condição de parada **(c)**: teto
de segurança de 10 ciclos). As condições (a) "2 ciclos seguidos só com marginais" e (b)
"2 vereditos NÃO seguidos" **não** dispararam — então, pela regra do método (Lei do
Lastro), **não carimbo "saturado"**.

**Mas o motivo importa e é uma boa notícia:** a ideia **amadureceu no design** (falhas
ALTA de mecanismo: 11 → 0 já no ciclo 6, e ficaram em 0). A ALTA que reapareceu no ciclo
10 **não é de engenharia — é uma escolha de negócio** (ferramenta vs. produto), sobre a
qual **dois críticos independentes convergiram**, e que a V9 resolve **decidindo**
(ferramenta interna primeiro). Os últimos ciclos deixaram de refinar o *como* e passaram
a expor o *o quê estratégico* — e isso **não se satura com mais crítica; satura com a sua
ratificação**.

### As decisões que ficam com você (não comigo)

1. **Ferramenta interna primeiro?** A V9 assume que sim. Se você quer mirar produto para
   vender desde já, é outra empresa (GTM/curadoria/vendas) e o plano muda.
2. **Validar o Trilho A** na documentação real da plataforma: existe agendamento/handoff
   nativo disparável? Isso destrava (ou reconcebe) a Fase 2 inteira. **Fazer antes de codar a Fase 2.**
3. **Onde começar:** qual é a **primeira rotina de preparo** que mais te consome hoje
   (manhã de licitações? triagem de e-mails? cockpit?) — é por ela que a Fase 2 começa.

### O que já está pronto para agir (independe das decisões acima)

A **Fase 1** (o painel montador, `index.html`) já funciona e já entrega o "mapa de
capacidades" + prompts curados — é a cunha de baixo risco. Ela **não depende** de nenhuma
das 3 decisões e pode ser usada hoje.

---

## 15. Sumário executivo (uma tela)

- **O que é:** ferramenta interna que vira suas capacidades já instaladas no Claude em
  botões; **monta** comandos (Fase 1) e **prepara** trabalho recorrente coletando/
  organizando dados frescos (Fase 2), sempre deixando a **decisão** com você.
- **A virada:** não é "mais etapas" — é **1 decisão + o resto inferido** por receitas
  editáveis. Modelo/superfície/retorno/pasta/conectores entram como recibo, não formulário.
- **Segurança:** a IA só **aumenta** cautela, nunca remove; alto risco nunca sai sozinho;
  proveniência do dado visível.
- **Retenção real:** eliminar o **toil de coleta/preparo**, não substituir julgamento.
- **Fosso:** irrelevante como ferramenta interna; se virar produto, mora no **conteúdo
  vertical BR** (não no painel), com economia de **consultoria**, não de software.
- **Status:** design maduro; **3 decisões estratégicas** suas destravam a construção.
