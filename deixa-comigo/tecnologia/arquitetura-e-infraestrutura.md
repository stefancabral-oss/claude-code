# Arquitetura e Infraestrutura — Deixa Comigo
### Análise pedida pelo fundador em 31/07/2026 · insumo das Etapas 16 (dados e tecnologia), 19–22 (MVP) e 31 (escala)

> **Regra de leitura:** custos são **estimativas de ordem de grandeza** com preços de mercado de referência, não cotações. Servem para decidir arquitetura e sequência, não para orçamento. Cada linha precisa de cotação real antes de virar compromisso.

---

## O princípio que organiza tudo

**A infraestrutura desaparece percentualmente com a escala** — de ~10% da receita no MVP para **0,5%** em escala. Ela nunca será o problema econômico da Deixa Comigo. Será o problema **arquitetural**: decisões tomadas cedo que travam ou libertam a empresa depois.

Por isso este documento separa duas coisas que costumam ser confundidas: **o que custa** (pouco, e cada vez menos) e **o que compromete** (algumas decisões que não se desfazem).

---

## Estágio 1 — PILOTO (10 a 50 pessoas cuidadas · ~150 missões/mês)

**Filosofia: comprar tudo. Zero código próprio.**

| Componente | Escolha | R$/mês |
|---|---|---|
| Canal | WhatsApp Business API via BSP | 300 |
| IA | LLM por API, com cache de prompt | 195 |
| Voz | STT + TTS por API | 120 |
| Dados | Postgres gerenciado + pgvector + object storage | 250 |
| Orquestração | Ferramenta de automação gerenciada (n8n ou similar) | 200 |
| Console humano | Ferramenta pronta de atendimento | 300 |
| Observabilidade | Logs e métricas gerenciados | 150 |
| Backup e segurança | Cópia automática, gestão de segredos | 150 |
| **Total** | | **~R$ 1.700** (R$ 33/pessoa) |

**Por quê assim:** o objetivo do piloto não é ter software — é **descobrir quais missões existem de verdade e quanto custam em minutos humanos**. Codificar processo antes de conhecê-lo é a forma mais cara de errar. Um mês de montagem contra seis de desenvolvimento.

**O que já precisa estar certo aqui:** as 4 decisões irreversíveis (adiante).

---

## Estágio 2 — MVP COMERCIAL (300 pessoas cuidadas · ~900 missões/mês)

**Filosofia: plataforma própria de missões; resto gerenciado.**

| Componente | Escolha | R$/mês |
|---|---|---|
| Canal | WhatsApp Business API (volume) | 1.200 |
| IA | API frontier + roteamento por complexidade + cache | 990 |
| Voz | STT + TTS com voz clonada da assessora | 675 |
| Dados | Postgres gerenciado + réplica + storage criptografado | 1.800 |
| **Grafo** | Neo4j gerenciado ou Postgres com extensões | 1.500 |
| **Plataforma de missões** | **aplicação própria** — o ativo | 1.200 |
| Console + telefonia | Atendimento humano de exceção | 900 |
| Auditoria | Trilha LGPD, logs imutáveis | 800 |
| Ambientes e CI | Dev/homologação, entrega contínua | 600 |
| Segurança | WAF, segredos, pentest amortizado | 1.200 |
| **Total** | | **~R$ 11.000** (R$ 36/pessoa) |

**O que passa a ser próprio:** a **plataforma de missões** (fila, estado, SLA, recibo de resolução) e o **grafo**. São o produto. Todo o resto continua comprado.

**Marco técnico do estágio:** instrumentação de **minutos humanos por missão** — sem ela, a Etapa 9 nunca sai do estimado e o preço nunca sai da intuição.

---

## Estágio 3 — ESCALA (2 mi de vidas · ~616 mil missões/mês)

**Filosofia: híbrido. Inferência própria para volume, API para raciocínio difícil.**

### A decisão de inferência — onde mora a maior economia

| Modelo | Custo/mês |
|---|---|
| (a) Tudo por API de terceiros | **R$ 894.000** (LLM 555k + voz 339k) |
| (b) **Híbrido** — cluster próprio + API frontier em 25% das missões + TTS self-host | **R$ 316.000** |
| **Economia** | **~R$ 578.000/mês** |

**Ponto de virada:** abaixo de **~R$ 300 mil/mês** de gasto em API, inferência própria **não se paga** — o custo de MLOps (time, GPU ociosa, atualização de modelo) come a economia. Construir isso no MVP seria erro caro.

**Como o roteamento funciona:** tarefas de alto volume e baixa dificuldade (classificar intenção, extrair dados de documento, transcrever áudio, resumir, gerar rascunho padrão) vão para modelo próprio; raciocínio difícil (formular argumento de recurso, interpretar negativa complexa, decidir escalonamento) continua em modelo frontier. A qualidade onde importa não se terceiriza para economizar.

### Infraestrutura de plataforma na escala

| Componente | R$/mês |
|---|---|
| WhatsApp API (≈1,8 mi conversas) | 270.000 |
| IA (modelo híbrido) | 316.000 |
| Banco distribuído + réplicas + backup | 45.000 |
| Grafo em cluster | 38.000 |
| Storage de documentos de saúde (criptografado) | 22.000 |
| Kubernetes / plataforma de aplicação | 35.000 |
| CDN, rede, WAF, proteção DDoS | 18.000 |
| Observabilidade e SIEM | 25.000 |
| Data lake e BI (o Mapa institucional) | 30.000 |
| Continuidade e recuperação de desastre | 20.000 |
| Segurança contínua (pentest, auditoria, SOC) | 40.000 |
| **Total** | **~R$ 859.000/mês** |

**= 0,5% da receita · R$ 0,43 por vida/mês.**

Observe: **o WhatsApp custa quase tanto quanto toda a IA.** Em escala, o canal vira item de negociação relevante — contrato direto com Meta ou BSP com volume negociado deixa de ser detalhe.

---

## ⚠️ As 4 decisões IRREVERSÍVEIS — precisam estar certas desde o piloto

Quase tudo aqui é trocável depois. **Estas quatro não são:**

### 1. Modelo de dados do grafo
Migrar micro-grafos de pacientes com anos de histórico é cirurgia de coração aberto. **Desenhar como se fossem 2 milhões desde os primeiros 50.** Chaves estáveis, versionamento de fatos, separação clara entre dado do titular e dado agregado.

### 2. Residência e segregação dos dados
Dado de saúde é **sensível** na LGPD. Onde ele nasce define o que é possível depois — nuvem, região, contrato de processamento, subprocessadores. Mudar depois é pesadelo regulatório e contratual. Definir **antes do primeiro cliente**.

### 3. Trilha de auditoria
**Não se retrofita.** Cada acesso a dado de saúde precisa deixar rastro imutável desde o primeiro cliente — quem viu, quando, por qual missão, com qual base legal. É o que sustenta tecnicamente a promessa "auditável" da marca e a defesa em qualquer questionamento.

### 4. Arquitetura de consentimento
Consentimento **não se obtém retroativamente**. Se o contrato do primeiro cliente não previr o uso longitudinal (o Mapa por anos/décadas), a memória composta — que é a vantagem competitiva — nasce com prazo de validade. O consentimento precisa ser específico, granular e renovável por desenho.

---

## O que NÃO construir cedo

- **Inferência própria** — só acima de ~R$ 300k/mês de API
- **App do cliente** — WhatsApp já é o app; construir aplicativo antes de provar a operação é distração cara
- **Integrações com operadoras** — as APIs não existem ou não são abertas; o caminho é canal humano/digital padrão
- **Automação de ponta a ponta antes de conhecer as missões** — codificar processo desconhecido é o erro mais caro do MVP

---

## Sequência recomendada

| Quando | Construir | Custo/mês |
|---|---|---|
| Agora (piloto) | Montagem com ferramentas prontas + as 4 decisões irreversíveis certas | ~R$ 1,7 mil |
| MVP comercial (300) | Plataforma de missões própria + grafo + instrumentação de minutos | ~R$ 11 mil |
| 10–50 mil vidas | Escalar gerenciados; avaliar inferência híbrida | ~R$ 60–150 mil |
| 500 mil+ vidas | Inferência própria, grafo em cluster, SOC | ~R$ 400–900 mil |

**Consequência para o motor:** esta análise é insumo direto da **Etapa 16** (estrutura de dados, memória e tecnologia) — cujas portas 16.1 a 16.5 devem adotar as 4 decisões irreversíveis como critério de "pronto" — e da **Etapa 22** (construir e testar), que deve nascer já com a instrumentação de minutos humanos por missão.
