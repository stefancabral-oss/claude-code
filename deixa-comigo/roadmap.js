// ============================================================
// DEIXA COMIGO — ROADMAP v2 (pós-auditoria)
// 31 etapas × 5 portas = 155 validações
// Ordem e conteúdo já incorporam as 13 correções (F1–F13).
// Este arquivo é a FONTE DE VERDADE do roadmap no GitHub.
// ============================================================

const ROADMAP = {
  versao: "2.0-auditada",
  correcoes: {
    F1: "Loop-back real: retornos 5→2, 22→21, 26→19 movem o fluxo de verdade, com contador de tentativas (máx. 3).",
    F2: "Estado persistente + invalidação em cascata: voltar reabre todas as etapas entre o alvo e a atual.",
    F3: "Registro Vivo virou hook: ao fechar cada etapa o app pede as novas perguntas/decisões (não é mais gate de largada).",
    F4: "Custos (agora etapa 9) e Preço (etapa 10) movidos para ANTES do Modelo de Negócio (etapa 11).",
    F5: "Identidade/nome (agora etapa 17) movida para ANTES do Jurídico/societário (etapa 18).",
    F6: "2.3 e 2.5 rebaixadas a HIPÓTESES, confirmadas na etapa 5 com evidência.",
    F7: "Porta 23.5: pipeline com ≥20 contatos reais qualificados antes do piloto.",
    F8: "Porta 9.5: runway — caixa cobre ≥6 meses de operação sem receita.",
    F9: "Portas 15.2 / 21.3 / 28.5: pessoas REAIS nomeadas e disponíveis, não cargos hipotéticos.",
    F10: "Preço Canônico: painel único (fonte de verdade), atualizado apenas nas etapas 10, 26 e 27.",
    F11: "Público Canônico (3.5): todas as validações (5, 8, 10, 20) usam explicitamente este público.",
    F12: "Predicados subjetivos ganharam critério numérico (≥6/8 entrevistas, margem ≥30%, 3 meses de ciclo etc.).",
    F13: "Contrato de retorno uniforme do motor: {status: 'ok'|'blocked'|'loopback'}."
  },
  blocos: [
    { id: "B1", nome: "Descoberta e Validação", etapas: [1, 2, 3, 4, 5] },
    { id: "B2", nome: "Estratégia, Economia e Modelo", etapas: [6, 7, 8, 9, 10, 11] },
    { id: "B3", nome: "Desenho do Serviço e Fundamentos", etapas: [12, 13, 14, 15, 16, 17, 18] },
    { id: "B4", nome: "MVP", etapas: [19, 20, 21, 22] },
    { id: "B5", nome: "Piloto Pago", etapas: [23, 24, 25, 26, 27] },
    { id: "B6", nome: "Lançamento e Operação Contínua", etapas: [28, 29, 30, 31] }
  ],
  etapas: [
    {
      num: 1, titulo: "Registro vivo", bloco: "B1",
      resumo: "Criar o documento único que acompanha TODO o resto (corrigido pela F3: não exige prever perguntas futuras).",
      portas: [
        { label: "Documento vivo único criado", criterio: "Um só lugar (doc/planilha), com link conhecido por todos." },
        { label: "Decisões já tomadas migradas", criterio: "100% das decisões conhecidas até hoje estão no documento." },
        { label: "Abertos JÁ CONHECIDOS têm dono e prazo", criterio: "Só o que já se sabe — novas perguntas entram via hook (F3)." },
        { label: "Hook de registro ativado", criterio: "Ao fechar cada etapa, o app pergunta: 'que perguntas/decisões novas surgiram?'" },
        { label: "Rotina de revisão definida", criterio: "Dia e hora fixos por semana para revisar o registro." }
      ]
    },
    {
      num: 2, titulo: "Problema central", bloco: "B1",
      resumo: "Definir o problema — com 2.3 e 2.5 como HIPÓTESES (F6), não decisões.",
      portas: [
        { label: "Problema escrito em UMA frase", criterio: "Frase única, específica, sem 'e também'." },
        { label: "É dor real observável", criterio: "3+ fatos observados, não desejo vago." },
        { label: "HIPÓTESE: quem sente a dor", criterio: "Registrada como hipótese — será confirmada na etapa 5 (F6)." },
        { label: "Como a dor se manifesta hoje", criterio: "3+ situações concretas descritas." },
        { label: "HIPÓTESE: vale a pena resolver", criterio: "Frequência × intensidade estimadas — será testada nas etapas 4–5 (F6)." }
      ]
    },
    {
      num: 3, titulo: "Públicos possíveis", bloco: "B1",
      resumo: "Mapear e PRIORIZAR o público — a 3.5 cria o Público Canônico (F11).",
      portas: [
        { label: "2+ públicos candidatos listados", criterio: "Mínimo dois, descritos separadamente." },
        { label: "Perfil de cada público descrito", criterio: "Quem são, como vivem, contexto da dor." },
        { label: "Tamanho estimado com fonte", criterio: "Número + de onde veio o número." },
        { label: "Canal de acesso identificado", criterio: "Como chegar a cada público, de forma prática." },
        { label: "PÚBLICO CANÔNICO priorizado", criterio: "Um único público inicial — TODAS as validações futuras (5, 8, 10, 20) usam este (F11)." }
      ]
    },
    {
      num: 4, titulo: "Mercado e alternativas", bloco: "B1",
      resumo: "Concorrentes, substitutos e a 'gambiarra atual'.",
      portas: [
        { label: "Concorrentes diretos listados", criterio: "Mínimo 3, com nome e link." },
        { label: "Substitutos listados", criterio: "O que resolve a mesma dor por outro caminho." },
        { label: "'Gambiarra atual' descrita", criterio: "Como o público canônico resolve hoje, sem você." },
        { label: "Comparação em tabela", criterio: "Preço, forças e fraquezas lado a lado." },
        { label: "Lacuna identificada", criterio: "O espaço que ninguém ocupa, escrito em 1 frase." }
      ]
    },
    {
      num: 5, titulo: "Validação do problema", bloco: "B1",
      resumo: "Confirmar com o Público Canônico as hipóteses 2.3 e 2.5. Critério numérico (F12) e loop-back real (F1/F2).",
      portas: [
        { label: "Roteiro de entrevista pronto", criterio: "Perguntas abertas, sem induzir resposta." },
        { label: "8+ pessoas do PÚBLICO CANÔNICO recrutadas", criterio: "Do público da 3.5, não conhecidos aleatórios (F11)." },
        { label: "8+ entrevistas realizadas", criterio: "Feitas e anotadas." },
        { label: "Respostas tabuladas", criterio: "Padrões visíveis em tabela/quadro." },
        { label: "CONFIRMADO: ≥6 de 8 validam a dor", criterio: "Confirma as hipóteses 2.3 e 2.5 (F12). Se falhar → voltar à etapa 2." }
      ],
      loopback: { porta: 4, alvo: 2, msg: "Problema derrubado pelas entrevistas — reabrir etapa 2 (invalida 3 e 4 em cascata)." }
    },
    {
      num: 6, titulo: "Estratégia", bloco: "B2",
      resumo: "Onde joga, onde não joga, aonde quer chegar.",
      portas: [
        { label: "Objetivo de 12–24 meses definido", criterio: "Numérico e datado." },
        { label: "Onde a empresa JOGA", criterio: "Segmentos/regiões/tipos de serviço escolhidos." },
        { label: "Onde a empresa NÃO joga", criterio: "Recusas explícitas, por escrito." },
        { label: "Vantagem a construir definida", criterio: "O que ficará difícil de copiar." },
        { label: "Estratégia em 1 página", criterio: "Cabe numa página e um terceiro entende." }
      ]
    },
    {
      num: 7, titulo: "Posicionamento", bloco: "B2",
      resumo: "'Para X, somos Y que Z' — testado com gente de fora.",
      portas: [
        { label: "Categoria definida", criterio: "Em que 'prateleira mental' você entra." },
        { label: "Diferencial definido", criterio: "Diferente dos concorrentes mapeados na 4.1." },
        { label: "Frase de posicionamento escrita", criterio: "'Para [público canônico], somos [categoria] que [diferencial]'." },
        { label: "Clareza testada com 3 terceiros", criterio: "3 pessoas repetem a frase com as próprias palavras, sem ajuda (F12)." },
        { label: "Diferenciação verificada", criterio: "Nenhum concorrente da 4.1 usa a mesma promessa." }
      ]
    },
    {
      num: 8, titulo: "Proposta de valor", bloco: "B2",
      resumo: "Ganho + dor resolvida, melhor que a gambiarra — validada com o Público Canônico.",
      portas: [
        { label: "Ganho principal definido", criterio: "O que o cliente ganha, em 1 frase." },
        { label: "Dor resolvida definida", criterio: "Amarrada ao problema da etapa 2." },
        { label: "Melhor que a alternativa", criterio: "Comparação explícita com a gambiarra da 4.3." },
        { label: "Promessa escrita", criterio: "Texto final da promessa de valor." },
        { label: "Validada com 5+ do PÚBLICO CANÔNICO", criterio: "5+ pessoas da 3.5 dizem que pagariam/usariam (F11)." }
      ]
    },
    {
      num: 9, titulo: "Custos e caixa", bloco: "B2",
      resumo: "MOVIDA para antes do modelo (F4). Inclui a porta de runway (F8).",
      portas: [
        { label: "Custos fixos mensais levantados", criterio: "Lista completa com valores." },
        { label: "Custos variáveis por entrega", criterio: "O que cada atendimento consome." },
        { label: "Custo de atender 1 cliente", criterio: "Número único: custo unitário." },
        { label: "Break-even e margem-alvo", criterio: "Ponto de equilíbrio calculado; margem-alvo ≥ 30% (F12)." },
        { label: "RUNWAY: caixa p/ ≥6 meses", criterio: "Caixa disponível cobre ≥6 meses de operação sem receita (F8)." }
      ]
    },
    {
      num: 10, titulo: "Preço (hipóteses)", bloco: "B2",
      resumo: "MOVIDA para antes do modelo (F4). Cria o Preço Canônico v1 (F10).",
      portas: [
        { label: "Faixa de preço definida", criterio: "Cobre custo unitário (9.3) + margem-alvo (9.4)." },
        { label: "Comparada com o mercado", criterio: "Contra a tabela da 4.4." },
        { label: "Disposição a pagar testada", criterio: "5+ pessoas do PÚBLICO CANÔNICO reagiram ao preço (F11)." },
        { label: "Preço do piloto definido", criterio: "Valor fechado para o piloto pago." },
        { label: "PREÇO CANÔNICO v1 registrado", criterio: "Registrado no painel — única fonte de verdade de preço (F10)." }
      ]
    },
    {
      num: 11, titulo: "Modelo de negócio", bloco: "B2",
      resumo: "Agora a 'conta fecha' usa custos (9) e preço (10) REAIS — não palpite (F4).",
      portas: [
        { label: "Como cobra definido", criterio: "Mensalidade, avulso, pacote — escolhido." },
        { label: "Quem paga definido", criterio: "Pagador ≠ usuário? Resolvido." },
        { label: "Estrutura de receita montada", criterio: "Com o Preço Canônico v1 (10.5)." },
        { label: "Estrutura de custo montada", criterio: "Com os números reais da etapa 9." },
        { label: "CONTA FECHA com dados reais", criterio: "Receita projetada − custos ≥ margem-alvo da 9.4 (F12)." }
      ]
    },
    {
      num: 12, titulo: "Conceber o serviço", bloco: "B3",
      resumo: "O que entrega e como o cliente recebe.",
      portas: [
        { label: "Entrega principal definida", criterio: "O que sai da 'cozinha'." },
        { label: "Como o cliente recebe", criterio: "Passo a passo do recebimento." },
        { label: "Formato e canal definidos", criterio: "WhatsApp, app, presencial — escolhido." },
        { label: "Ganho percebido descrito", criterio: "O que o cliente sente/ganha ao final." },
        { label: "Serviço descrito em 1 página", criterio: "Descrição completa e entendível." }
      ]
    },
    {
      num: 13, titulo: "Escopo e limites", bloco: "B3",
      resumo: "O que faz, o que NÃO faz, exceções e recusas.",
      portas: [
        { label: "Lista do que FAZ", criterio: "Explícita e finita." },
        { label: "Lista do que NÃO faz", criterio: "Explícita — protege a operação." },
        { label: "Casos de exceção definidos", criterio: "O que acontece nos limites." },
        { label: "Critérios de recusa de cliente", criterio: "Quando dizer não a um cliente." },
        { label: "Escopo documentado", criterio: "Anexável ao contrato da etapa 18." }
      ]
    },
    {
      num: 14, titulo: "Jornada do cliente", bloco: "B3",
      resumo: "Do primeiro contato ao pós-atendimento, sem buracos.",
      portas: [
        { label: "Primeiro contato mapeado", criterio: "Como o cliente descobre e chega." },
        { label: "Contratação mapeada", criterio: "Da proposta ao 'sim'." },
        { label: "Entrega e uso mapeados", criterio: "A experiência durante o serviço." },
        { label: "Pós-atendimento mapeado", criterio: "Follow-up, recompra, indicação." },
        { label: "Zero buracos na jornada", criterio: "Nenhum passo sem dono e sem próxima ação (F12)." }
      ]
    },
    {
      num: 15, titulo: "Operação e time", bloco: "B3",
      resumo: "Quem faz o quê — com gente REAL, não cargos hipotéticos (F9).",
      portas: [
        { label: "Tarefas operacionais listadas", criterio: "Todas as tarefas recorrentes." },
        { label: "TIME REAL nomeado e disponível", criterio: "Cada tarefa tem pessoa real, contratada/disponível — não um cargo a existir (F9)." },
        { label: "Ferramentas definidas", criterio: "Com quê cada tarefa é feita." },
        { label: "Ordem e fluxo desenhados", criterio: "Sequência visual do trabalho." },
        { label: "Tempo e capacidade estimados", criterio: "Horas por tarefa e clientes suportados." }
      ]
    },
    {
      num: 16, titulo: "Dados e tecnologia", bloco: "B3",
      resumo: "O que guarda, onde, como usa, com segurança.",
      portas: [
        { label: "Quais dados guardar", criterio: "Lista mínima necessária (base p/ LGPD na 18)." },
        { label: "Onde guardar", criterio: "Sistema/local definido." },
        { label: "Como consultar e usar", criterio: "Fluxo de uso no dia a dia." },
        { label: "Segurança e backup definidos", criterio: "Acesso restrito + cópia automática." },
        { label: "Tecnologia base escolhida", criterio: "Stack mínima para operar." }
      ]
    },
    {
      num: 17, titulo: "Identidade (nome primeiro!)", bloco: "B3",
      resumo: "MOVIDA para antes do jurídico (F5): sem nome não há contrato nem CNPJ.",
      portas: [
        { label: "Nome escolhido", criterio: "Definitivo — vai para contrato e CNPJ (F5)." },
        { label: "Domínio e marca verificados", criterio: "Domínio livre + busca no INPI feita." },
        { label: "Tom de voz definido", criterio: "Como a marca fala." },
        { label: "Visual mínimo pronto", criterio: "Logo, cores, tipografia básica." },
        { label: "Aplicações básicas prontas", criterio: "Proposta e apresentação com a marca." }
      ]
    },
    {
      num: 18, titulo: "Jurídico e societário", bloco: "B3",
      resumo: "Agora DEPOIS do nome (F5): contrato, LGPD, regulação, CNPJ.",
      portas: [
        { label: "Modelo de contrato pronto", criterio: "Com o nome real da 17.1 e o escopo da 13.5." },
        { label: "Conformidade LGPD", criterio: "Sobre os dados definidos na etapa 16." },
        { label: "Regras do setor atendidas", criterio: "Regulação específica verificada." },
        { label: "Estrutura societária constituída", criterio: "CNPJ, regime fiscal, sócios." },
        { label: "Validado por especialista", criterio: "Advogado/contador revisou e aprovou." }
      ]
    },
    {
      num: 19, titulo: "Definir o MVP", bloco: "B4",
      resumo: "O mínimo que já resolve a dor — construível rápido.",
      portas: [
        { label: "Lista de desejos completa", criterio: "Tudo que gostaria de ter, sem filtro." },
        { label: "Cortado ao mínimo", criterio: "Só o que resolve a dor central da etapa 2." },
        { label: "'Fora do MVP' explícito", criterio: "Lista do que NÃO entra agora." },
        { label: "Construível em ≤6 semanas", criterio: "Estimativa honesta cabe em 6 semanas (F12)." },
        { label: "Entrega valor real sozinho", criterio: "Mesmo mínimo, o cliente já sai melhor." }
      ]
    },
    {
      num: 20, titulo: "Validação do MVP (definição)", bloco: "B4",
      resumo: "O que prova que funcionou — número, prazo e público canônico.",
      portas: [
        { label: "Hipótese a testar definida", criterio: "Com o PÚBLICO CANÔNICO da 3.5 (F11)." },
        { label: "Métrica de sucesso definida", criterio: "Uma métrica principal." },
        { label: "Forma de medir definida", criterio: "Instrumento e responsável pela medição." },
        { label: "Meta numérica definida", criterio: "Número-alvo explícito (usado na 26.5) (F12)." },
        { label: "Prazo de validação definido", criterio: "Data-limite para o veredito." }
      ]
    },
    {
      num: 21, titulo: "Roadmap do MVP", bloco: "B4",
      resumo: "MVP virando tarefas com dono real e prazo.",
      portas: [
        { label: "Quebrado em tarefas", criterio: "Tarefas de no máximo alguns dias cada." },
        { label: "Tarefas priorizadas", criterio: "Ordem de ataque definida." },
        { label: "Responsáveis REAIS atribuídos", criterio: "Pessoas da 15.2, não cargos (F9)." },
        { label: "Prazos definidos", criterio: "Data em cada tarefa." },
        { label: "Marcos de entrega definidos", criterio: "Pontos de checagem no caminho." }
      ]
    },
    {
      num: 22, titulo: "Construir e testar internamente", bloco: "B4",
      resumo: "Cliente ainda NÃO entra. Falha estrutural → loop-back real à 21 (F1).",
      portas: [
        { label: "MVP construído", criterio: "Conforme roadmap da 21." },
        { label: "Cada função testada", criterio: "Checklist de funções, todas passando." },
        { label: "Jornada completa simulada", criterio: "Alguém do time viveu a jornada da 14 inteira." },
        { label: "Erros corrigidos (ou loop-back)", criterio: "Falhas pontuais corrigidas; falha estrutural → voltar à 21 (F1)." },
        { label: "Aprovado para ir a cliente", criterio: "Decisão formal registrada no Registro Vivo." }
      ],
      loopback: { porta: 3, alvo: 21, msg: "Falha estrutural no teste interno — reabrir o roadmap (21) e reconstruir." }
    },
    {
      num: 23, titulo: "Máquina comercial e pipeline", bloco: "B5",
      resumo: "Preparar venda/cobrança/atendimento + a porta de leads que faltava (F7).",
      portas: [
        { label: "Venda pronta", criterio: "Script + proposta comercial prontos." },
        { label: "Contratação e cobrança prontas", criterio: "Contrato da 18 + meio de cobrar funcionando." },
        { label: "Atendimento pronto", criterio: "Canal + SLA definidos." },
        { label: "Operação de entrega pronta", criterio: "Time da 15 sabe executar." },
        { label: "PIPELINE: ≥20 contatos qualificados", criterio: "20+ contatos reais do PÚBLICO CANÔNICO com forma de abordar (F7)." }
      ]
    },
    {
      num: 24, titulo: "Piloto pago", bloco: "B5", marco: "🏁 PRIMEIRO CLIENTE REAL",
      resumo: "Vender e entregar de verdade, cobrando o preço canônico do piloto.",
      portas: [
        { label: "Prospecção iniciada", criterio: "Abordagens feitas a partir do pipeline da 23.5." },
        { label: "≥1 venda PAGA fechada", criterio: "Dinheiro comprometido, no Preço Canônico do piloto (10.4)." },
        { label: "Contratado e cobrado", criterio: "Contrato assinado + cobrança emitida e paga." },
        { label: "Entrega executada", criterio: "Serviço prestado de verdade." },
        { label: "Ciclo fechado com o cliente", criterio: "Encerramento formal + porta aberta p/ feedback." }
      ]
    },
    {
      num: 25, titulo: "Medir o piloto", bloco: "B5",
      resumo: "Números + voz do cliente, contra a meta da etapa 20.",
      portas: [
        { label: "Métricas de operação coletadas", criterio: "Tempo, custo real, erros." },
        { label: "Métricas financeiras coletadas", criterio: "Receita real vs custo real do piloto." },
        { label: "Feedback do cliente ouvido", criterio: "Conversa estruturada pós-entrega." },
        { label: "Comparado com a meta da 20.4", criterio: "Número real vs número-alvo." },
        { label: "Aprendizados no Registro Vivo", criterio: "Tudo registrado via hook (F3)." }
      ]
    },
    {
      num: 26, titulo: "Corrigir", bloco: "B5",
      resumo: "Ajustar produto, operação e preço. Decisão com critério (F12) e loop-back real (F1).",
      portas: [
        { label: "Produto ajustado", criterio: "Mudanças derivadas do feedback da 25.3." },
        { label: "Operação ajustada", criterio: "Gargalos da 25.1 atacados." },
        { label: "Preço ajustado (canônico)", criterio: "Se mudou, atualiza o PREÇO CANÔNICO no painel (F10)." },
        { label: "Pendências repriorizadas", criterio: "Backlog reordenado pós-piloto." },
        { label: "DECISÃO: seguir (≥70% da meta)", criterio: "Meta da 20.4 atingida ≥70% → segue; senão → voltar à 19 (F12/F1)." }
      ],
      loopback: { porta: 4, alvo: 19, msg: "Piloto abaixo de 70% da meta — repensar o MVP (19). Invalida 20–25 em cascata." }
    },
    {
      num: 27, titulo: "Primeira versão comercial", bloco: "B5",
      resumo: "Do piloto artesanal à oferta repetível, com preço firmado.",
      portas: [
        { label: "Entrega padronizada", criterio: "Mesmo processo para qualquer cliente novo." },
        { label: "PREÇO CANÔNICO v2 firmado", criterio: "Preço comercial definitivo registrado no painel (F10)." },
        { label: "Processo documentado", criterio: "Outra pessoa consegue executar lendo." },
        { label: "Opera sem heroísmo", criterio: "≤20% de horas extras para cumprir entregas (F12)." },
        { label: "Oferta empacotada", criterio: "Nome, preço, escopo e materiais prontos p/ vender." }
      ]
    },
    {
      num: 28, titulo: "Preparar o lançamento", bloco: "B6",
      resumo: "Aquisição, materiais, capacidade e gente de verdade.",
      portas: [
        { label: "Canal de aquisição definido", criterio: "O motor recorrente de novos clientes (não só o evento de lançar)." },
        { label: "Materiais de venda produzidos", criterio: "Site/página, proposta, apresentação." },
        { label: "Capacidade p/ demanda projetada", criterio: "Time da 15 aguenta a meta da 28.4." },
        { label: "Metas numéricas do lançamento", criterio: "Clientes e receita esperados, com número (F12)." },
        { label: "Equipe REAL preparada", criterio: "Pessoas reais treinadas na rotina (F9)." }
      ]
    },
    {
      num: 29, titulo: "Lançar", bloco: "B6",
      resumo: "Abrir as portas para o mercado de verdade.",
      portas: [
        { label: "No ar", criterio: "Canais e página publicados." },
        { label: "Aquisição ativada", criterio: "Canal da 28.1 rodando." },
        { label: "Primeiros leads recebidos", criterio: "Gente de fora chegando." },
        { label: "Clientes de mercado convertidos", criterio: "Vendas fora do círculo do piloto." },
        { label: "Entregas de mercado executadas", criterio: "Primeiras entregas pós-lançamento feitas." }
      ]
    },
    {
      num: 30, titulo: "Operação contínua", bloco: "B6", marco: "✅ EMPRESA FUNCIONANDO COM CLIENTES",
      resumo: "O marco de verdade: o ciclo roda sozinho, mês após mês, com critério numérico (F12).",
      portas: [
        { label: "Venda recorrente", criterio: "Novas vendas todo mês, sem esforço heroico." },
        { label: "Cobrança entra todo mês", criterio: "Faturamento e recebimento em rotina." },
        { label: "Entregas em série", criterio: "Múltiplos clientes atendidos em paralelo." },
        { label: "Atende e retém", criterio: "Churn sob controle; clientes voltam/permanecem." },
        { label: "CICLO AUTÔNOMO por 3 meses", criterio: "3 meses consecutivos com o ciclo completo rodando ≥ meta mínima de clientes ativos (F12)." }
      ]
    },
    {
      num: 31, titulo: "Melhoria contínua", bloco: "B6",
      resumo: "Estado permanente — não 'termina', entra em ciclo.",
      portas: [
        { label: "Painel de indicadores montado", criterio: "Métricas-chave visíveis semanalmente." },
        { label: "Revisão periódica acontecendo", criterio: "Ritual fixo de leitura dos números." },
        { label: "Melhoria de produto em ciclo", criterio: "Backlog vivo alimentado pelos números." },
        { label: "Melhoria de operação e preço", criterio: "Preço canônico revisado em ritual definido (F10)." },
        { label: "Ciclo de melhoria repetido", criterio: "Pelo menos 1 ciclo completo medido → melhorado → medido." }
      ]
    }
  ]
};

if (typeof module !== "undefined") module.exports = ROADMAP;
