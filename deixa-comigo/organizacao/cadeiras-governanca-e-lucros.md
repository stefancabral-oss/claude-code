# Estrutura organizacional, governança e distribuição de lucros
### Análise pedida pelo fundador em 01/08/2026 · complementa `tecnologia/arquitetura-e-infraestrutura.md` · insumo das Etapas 15 (operação e time), 18 (jurídico e societário) e 11 (modelo de negócio)

> **Regra de leitura:** salários são **faixas de mercado brasileiro de referência**, não cotações. Encargos, regimes tributários e regras de distribuição precisam de confirmação da contabilidade antes de virarem compromisso. Tudo aqui é **PROPOSTA** até o fundador decidir.

---

## O achado que muda a conta anterior

A análise de capacidade registrada em 31/07 concluiu que, com a IA operando, **o trabalho humano custa ~3% da receita** — e daí saiu a margem de 91%.

**Aquela conta estava incompleta.** Ela contou a **linha de frente** (as assessoras que executam missões) e esqueceu **a empresa** — CTO, engenheiros, SRE, segurança, DPO, produto, comercial, financeiro, jurídico, gente, conselho, auditoria. Carregando a estrutura inteira:

| Estágio | Vidas | Gente total | Custo de gente | % da receita |
|---|---|---|---|---|
| MVP | 300 | 4 | R$ 58,5 mil | **50,0%** |
| Robustez inicial | 10 mil | 26 | R$ 788 mil | **45,7%** |
| Consolidação | 100 mil | 117 | R$ 2,82 mi | **25,6%** |
| Nacional | 500 mil | 389 | R$ 7,99 mi | **16,9%** |
| Escala | 2 milhões | 1.278 | R$ 24,3 mi | **13,3%** |

**A linha de frente nunca é o custo.** Em escala ela é 2,3% da receita; a empresa que a sustenta é 11%. O gargalo econômico não é atender — é **existir com o rigor que dado de saúde exige**.

**E o segundo achado, mais importante:** o ponto frágil não é a escala. É a travessia dos **10 mil vidas** — onde a estrutura já precisa existir por inteiro e o volume ainda não chegou. É lá que empresas deste tipo morrem.

---

## As três camadas de gente

Confundir as três é o erro clássico. Elas têm custo, contrato e risco diferentes.

| Camada | Quem | Vínculo | Por quê |
|---|---|---|---|
| **1 · Linha de frente** | Assessoras que executam missões | **Terceirizada** (R$ 6 mil/mês carregado) | Elástica com o volume, não incha a folha, absorve sazonalidade. Decisão já tomada pelo fundador. |
| **2 · Núcleo da empresa** | Tecnologia, produto, operação, comercial, financeiro, jurídico, gente | **CLT** (carregado ~1,75× o salário) | É o ativo. Não se terceiriza quem constrói o grafo, a plataforma e a confiança. |
| **3 · Governança** | Conselho, auditoria independente, comitês | **Contrato de conselheiro / honorários** | Não é folha. É o preço de ser uma empresa em que um RH grande e um investidor conseguem confiar. |

**Regra que organiza tudo:** terceiriza-se **volume**, contrata-se **julgamento**. Assessora que segue roteiro é camada 1. Quem decide o que o roteiro deve dizer é camada 2.

---

## Estágio 1 — MVP · 300 vidas · receita ~R$ 117 mil/mês

**3 pessoas dentro, 1 terceirizada fora.** Nenhuma cadeira a mais.

| Cadeira | Qtd | Base | Vínculo |
|---|---|---|---|
| CEO / fundador | 1 | R$ 15.000 | pró-labore |
| Líder de operação | 1 | R$ 9.000 | CLT |
| Tecnologia (dev) | 1 | R$ 18.000 | PJ |
| Assessora de missões | 1 | R$ 6.000 | terceirizada |

Contabilidade, jurídico e DPO: **externos**. Conselho: **informal, sem remuneração** — 3 conselheiros com participação futura (0,25% a 0,5% cada, *vesting* em 4 anos) valem mais que 3 conselheiros pagos que ninguém consegue custear.

**Resultado antes de tributos: ~R$ 14 mil/mês (11,9%).** Sobrevive, não capitaliza.

---

## Estágio 2 — ROBUSTEZ · 10 mil vidas · receita ~R$ 1,72 mi/mês

> É este o estágio que o fundador identificou: **"a partir de dez mil vidas já tem a necessidade de uma empresa um pouco mais robusta"**. Correto — e a conta mostra por quê.

### As cadeiras

| Cadeira | Qtd | Base | Por que ela existe |
|---|---|---|---|
| **CEO** | 1 | R$ 40.000 | pró-labore |
| **CTO** | 1 | R$ 45.000 | O grafo e a plataforma são o ativo. Sem dono técnico sênior, as 4 decisões irreversíveis viram acidente. |
| **Head de Operações** | 1 | R$ 30.000 | Dono do SLA e do custo por missão |
| **Head Comercial** | 1 | R$ 32.000 | Dono do PEPM e do funil B2B |
| **Controller** | 1 | R$ 25.000 | Dono da margem por cliente e do caixa |
| **DPO / Encarregado LGPD** | 1 | R$ 20.000 | **Obrigatório** (LGPD art. 41). Dado de saúde é sensível. |
| Eng. de plataforma sênior | 3 | R$ 20.000 | Plataforma de missões |
| Eng. de dados / grafo | 1 | R$ 22.000 | O ativo de longo prazo |
| SRE / infraestrutura | 1 | R$ 22.000 | Disponibilidade e resposta a incidente |
| Eng. de IA (agentes e avaliação) | 1 | R$ 28.000 | Quem mede se a IA está acertando |
| Product Manager | 1 | R$ 18.000 | |
| Designer de serviço | 1 | R$ 14.000 | |
| Gerente de operações | 1 | R$ 18.000 | |
| Supervisor de operação | 1 | R$ 10.000 | Ponte com a terceirizada |
| Analista de qualidade de missão | 1 | R$ 10.000 | Auditoria por amostragem — sustenta a promessa "auditável" |
| Executivo de contas B2B | 2 | R$ 12.000 | |
| Customer Success B2B | 1 | R$ 12.000 | Renovação é onde o PEPM se prova |
| Analista financeiro/adm | 1 | R$ 9.000 | |
| Analista de gente | 1 | R$ 9.000 | |
| **Total interno** | **22** | **R$ 448 mil base** | **R$ 764 mil carregado** |
| Assessoras de missão | 4 | R$ 6.000 | terceirizada |

**Fora da folha:** jurídico externo R$ 15 mil · contabilidade R$ 8 mil · auditoria de privacidade R$ 10 mil · **conselho consultivo (3 membros × R$ 5 mil) R$ 10–15 mil** · infraestrutura R$ 60 mil · administrativo R$ 60 mil.

**Custo total ~R$ 951 mil/mês. Com aquisição (25% da receita): R$ 1,38 mi. Resultado ~R$ 341 mil (19,8%).**

### ⚠️ O vale da morte — a regra prática mais importante deste documento

Esta estrutura **empata em ~7.400 vidas**. Montada antes disso, ela queima:

| Vidas no momento da montagem | Queima mensal |
|---|---|
| 2.000 | **–R$ 693 mil** |
| 4.000 | **–R$ 434 mil** |
| 6.000 | **–R$ 176 mil** |
| 7.400 | equilíbrio |

E se o PEPM cair de R$ 79 para R$ 25, o equilíbrio sobe para **9.400 vidas** e a margem despenca para **4,3%** — o único estágio em que a empresa fica genuinamente frágil.

**Regra registrada:** *nenhuma cadeira do Estágio 2 é contratada por calendário. Cada uma entra por gatilho de volume ou de risco.* Montar a empresa robusta antes da receita robusta é a forma mais comum de morrer com o produto certo.

### Ordem de entrada das cadeiras (gatilhos, não datas)

| Gatilho | Cadeira que entra |
|---|---|
| Primeiro contrato B2B assinado | DPO/Encarregado (pode ser fracionado) · jurídico externo |
| 1.000 vidas | CTO · 1º eng. de plataforma · supervisor de operação |
| 2.500 vidas | Head de Operações · eng. de dados/grafo · Controller |
| 5.000 vidas | Head Comercial · 2º e 3º eng. · SRE · qualidade de missão |
| 7.500 vidas *(equilíbrio)* | Eng. de IA · Product · CS · analista de gente |
| 10.000 vidas | Conselho consultivo remunerado · designer · 2º executivo de contas |

---

## Estágio 3 — CONSOLIDAÇÃO · 100 mil vidas · receita ~R$ 11,0 mi/mês

**82 internos + 35 assessoras.** Aqui a empresa deixa de ser dirigida por uma pessoa.

| Bloco | Cadeiras | Pessoas |
|---|---|---|
| **Diretoria** | CEO, CTO, COO, CRO, CFO, **CISO**, Head de Dados/IA, Head de Produto, Head Jurídico/Compliance, Head de Gente, DPO | 11 |
| Engenharia | plataforma (12), SRE (3), dados (3), IA/avaliação (3), **segurança (2)**, QA (2) | 25 |
| Produto | PM (3), design (2) | 5 |
| Operação | gerentes (3), supervisores (8), qualidade (4), treinamento (2) | 17 |
| Comercial | contas B2B (8), CS (4), marketing (3) | 15 |
| Corporativo | financeiro (4), gente (3), jurídico interno (2) | 9 |

**Folha carregada R$ 2,61 mi (23,7% da receita).** Duas cadeiras novas merecem destaque: **CISO** (segurança deixa de ser tarefa e vira função — a partir daqui a empresa é alvo) e **CFO** de verdade (não controller): é quem sustenta rodada, conselho e auditoria.

**Governança passa a ser formal:** conselho de administração com 5 membros (R$ 15 mil cada, presidente R$ 25 mil) + comitê de auditoria + auditoria independente (~R$ 300 mil/ano). **Resultado ~R$ 5,19 mi/mês (47,2%).**

---

## Estágio 4 — NACIONAL · 500 mil vidas · receita ~R$ 47,3 mi/mês

**215 internos + 174 assessoras.** Diretoria estatutária de 6, gerências intermediárias, SOC próprio em formação, 2 comitês de conselho. Folha carregada R$ 6,95 mi (**14,7%**). Resultado ~R$ 29,9 mi (63,2%).

---

## Estágio 5 — ESCALA · 2 milhões de vidas · receita ~R$ 182,9 mi/mês

**585 internos + 693 assessoras = 1.278 pessoas.**

| Bloco | Pessoas | Folha carregada |
|---|---|---|
| Diretoria e VPs | 15 | R$ 2,0 mi |
| Engenharia e IA (inclui cluster próprio) | 212 | R$ 8,6 mi |
| Operação e qualidade | 152 | R$ 3,2 mi |
| Comercial e marketing | 100 | R$ 2,5 mi |
| Corporativo (financeiro, gente, jurídico, privacidade) | 76 | R$ 2,0 mi |
| Produto e design | 30 | R$ 0,9 mi |

**Receita por pessoa: R$ 143 mil/mês.** É o número que prova a tese — uma operadora de serviço tradicional faz R$ 15–25 mil por pessoa. **A IA não elimina o time; ela multiplica por 6 a 10 o que cada pessoa sustenta.**

---

## ⚖️ Conselho — o que custa e o que compra

| Estágio | Formato | Composição | Custo/mês |
|---|---|---|---|
| MVP | Consultivo informal | 3 conselheiros, **equity** (0,25–0,5%, *vesting* 4 anos) | R$ 0 |
| 10 mil | Consultivo remunerado | 3 × R$ 5 mil, reuniões trimestrais | R$ 10–15 mil |
| 100 mil | **Administração formal** + comitê de auditoria | 5 membros × R$ 15 mil, presidente R$ 25 mil | R$ 85 mil + auditoria R$ 25 mil |
| 500 mil | Administração + 2 comitês (auditoria, gente) | 5 × R$ 20 mil, presidente R$ 35 mil | R$ 115 mil + auditoria R$ 85 mil |
| 2 milhões | Administração + 3 comitês (+ tecnologia e privacidade) | 7 × R$ 25 mil, presidente R$ 45 mil | R$ 195 mil + auditoria R$ 210 mil |

**O que o conselho compra, além de conselho:** a partir do Estágio 3, um RH de empresa grande e qualquer investidor perguntam *quem fiscaliza esta empresa*. Conselho formal + auditoria independente é a resposta — e é barata: **0,3% da receita no Estágio 5**.

**Três itens que costumam ser esquecidos:**
- **Seguro D&O** para conselheiros e diretores — R$ 30–120 mil/ano a partir do conselho formal. Sem ele, conselheiro bom não aceita a cadeira.
- **Conselho consultivo ≠ conselho de administração.** O primeiro opina e não responde juridicamente. O segundo delibera e **responde**. Só formalize quando quiser que ele responda.
- **Comitê de auditoria antes da primeira rodada**, não depois — é o que transforma diligência de 90 dias em 30.

---

## 💰 Distribuição de lucros — três coisas diferentes que costumam ser confundidas

### 1 · Pró-labore (sócios que administram)
Obrigatório para quem administra. Carrega **INSS patronal 20% para a empresa** (sem teto) e IRRF progressivo (até 27,5%) para a pessoa física. É a forma **mais cara** de tirar dinheiro da empresa — mas é a que gera INSS, contribui para o resultado tributável e evita questionamento de distribuição disfarçada. **Mantenha-o no mínimo defensável e concentre o resto em lucros.**

### 2 · Distribuição de lucros aos sócios (dividendos)
Historicamente **isenta de IR na pessoa física** (Lei 9.249/95, art. 10) — foi essa isenção que sustentou toda a análise societária Setfree × Deixa Comigo da Etapa 6.

> ⚠️ **PENDÊNCIA — confirmar com a Cony Services antes de qualquer decisão societária.** A reforma do imposto de renda sancionada em 2025 introduz **retenção sobre dividendos acima de determinado valor mensal pagos pela mesma empresa à mesma pessoa física**, com vigência a partir de 2026. Se confirmada, ela **muda a aritmética da decisão da Etapa 6** e precisa entrar na conta antes de escolher entre "Setfree sócia" e "Setfree dona da marca". **Não tratar como fato até a contabilidade responder.**

**Pré-condições para distribuir (proposta de política):**
1. Lucro apurado em balanço, não em estimativa;
2. Caixa livre ≥ **12 meses** de custo fixo;
3. Nenhuma obrigação trabalhista, fiscal ou previdenciária em atraso;
4. Aprovação do conselho a partir do Estágio 3.

### 3 · PLR — participação dos empregados nos resultados
**É por aqui que a empresa divide lucro com o time, não por bônus.** Regida pela Lei 10.101/2000:

| | Bônus / gratificação | **PLR** |
|---|---|---|
| INSS + FGTS | **incide** (~28%) | **não incide** |
| IR da pessoa física | tabela normal | **tabela exclusiva, mais branda** |
| Dedutível para a empresa | sim | sim |
| Integra salário | **sim** (repercute em férias, 13º, rescisão) | **não** |

Exige acordo negociado com comissão de empregados **com representante do sindicato**, regras e metas definidas **antes** do período, e no máximo **duas parcelas por ano**. Feito certo, entrega ao time o mesmo valor líquido com **~28% menos custo** para a empresa.

**Proposta de política de PLR:** pool de **8% a 12% do resultado antes de tributos**, distribuído por meta coletiva (SLA de missão + retenção de contrato) e limitado a 1,5–2 salários por pessoa/ano.

### Política de reserva por estágio (PROPOSTA)

| Estágio | Distribuição aos sócios | PLR ao time | Retenção |
|---|---|---|---|
| MVP e até 7.400 vidas | **0%** — atravessar o vale exige caixa | 0% | 100% |
| 10 mil | até 20% do lucro líquido | 8% do resultado | ~72% |
| 100 mil | até 35%, com aprovação do conselho | 10% | ~55% |
| 500 mil+ | 40–50%, política formal de dividendos | 12% | ~40% |

---

## 🧾 Regime tributário — a regra dos 32%

Serviços no Lucro Presumido têm base presumida de **32% da receita**. Daí sai a regra de decisão:

> **Enquanto a margem real for maior que 32%, o Lucro Presumido tributa menos do que a empresa ganha de verdade. Abaixo disso, o Lucro Real passa a valer mais.**

Pelas projeções deste documento: o MVP (11,9%) e o Estágio 2 sob estresse (4,3%) ficariam **abaixo** da linha — Lucro Real. Os Estágios 3 a 5 ficam muito acima — **Presumido**, se o faturamento e a estrutura societária permitirem.

> ⚠️ **PENDÊNCIA — a reforma tributária (CBS/IBS) entra em transição a partir de 2026 e tende a aumentar a carga de setores de serviço**, que têm poucos créditos de insumo. Nenhuma projeção acima considera esse efeito. **Sexta pergunta para a Cony Services**, somando-se às cinco já registradas na Etapa 6.

---

## 🧪 Testes de estresse

### Se o PEPM cair de R$ 79 para R$ 25

| Estágio | Margem com R$ 79 | Margem com R$ 25 |
|---|---|---|
| 10 mil | 19,8% | **4,3%** ⚠️ |
| 100 mil | 47,2% | 21,2% |
| 500 mil | 63,2% | 37,4% |
| 2 milhões | 73,0% | **50,6%** |

**Leitura:** a empresa **sobrevive a um colapso de 68% no preço** — em escala. A fragilidade está toda concentrada na travessia dos 10 mil.

### Se a IA for pior do que o esperado (minutos humanos por missão)

| Vidas | 8,9 min | 19 min | 30 min |
|---|---|---|---|
| 10 mil | 4 assessoras · R$ 24 mil | 8 · R$ 48 mil | 12 · R$ 72 mil |
| 2 milhões | 693 · R$ 4,2 mi | 1.478 · R$ 8,9 mi | 2.334 · R$ 14,0 mi |

**Leitura:** mesmo com a IA rendendo **um terço** do esperado, a linha de frente vai de 2,3% para 7,7% da receita. **Não é isso que quebra a empresa.** O preço é.

---

## Consequência para o motor

| Etapa | O que este documento obriga |
|---|---|
| **Etapa 11 · Modelo de negócio** | O PEPM não pode mais ser hipótese. É a única variável que decide sobrevivência no Estágio 2. **Validar com 2–3 RHs reais continua sendo pré-requisito.** |
| **Etapa 15 · Operação e time** | Adotar as **três camadas** e a **tabela de gatilhos** como critério de contratação. Nenhuma cadeira por calendário. |
| **Etapa 18 · Jurídico e societário** | Decidir: (a) Ltda com conselho no contrato social ou S.A.; (b) acordo de PLR; (c) seguro D&O; (d) política de dividendos. E **refazer a aritmética da Etapa 6 se a retenção sobre dividendos se confirmar**. |
| **Etapa 9 · Custos e caixa** | O ponto de equilíbrio de **7.400 vidas** vira número de referência do plano de caixa. |
| **Etapa 30 · Operação contínua** | Só se declara operação contínua com a camada 2 mínima montada — sem CTO, DPO e qualidade de missão, o que existe é piloto estendido. |

**Pendências abertas por este documento (donos e prazos na Etapa 18):**
1. Retenção sobre dividendos a partir de 2026 — **Cony Services**
2. Efeito da reforma tributária sobre serviços — **Cony Services**
3. Escolha de veículo societário para conselho formal — **fundador + jurídico**
4. Faixa salarial real de mercado para CTO e CISO em São Paulo — **cotação, não estimativa**
