# Auditoria de Lógica — 13 correções aplicadas (v2)

O motor original (31 etapas × 5 portas) foi auditado e recebeu 13 achados.
Esta versão aplica **todos**. Mapa de cada achado → onde foi corrigido:

## 🔴 Críticos (quebravam o mecanismo)

| # | Achado | Correção aplicada |
|---|--------|-------------------|
| F1 | `voltarEtapa` não voltava — só desligava o motor; sem contador de tentativas | Loop-back real no app: botão "FALHOU → voltar" nas etapas 5, 22 e 26 move o fluxo de verdade. Contador por etapa-alvo; ao passar de 3 retornos o app exibe o banner "repensar o negócio". |
| F2 | Sem estado; voltar não invalidava etapas intermediárias | Estado persistente (localStorage + export/import `progress.json`). Todo loop-back reabre **em cascata** todas as etapas entre o alvo e a atual (5→2 invalida 3–4; 26→19 invalida 20–25). |

## 🟠 Altos (inversão temporal)

| # | Achado | Correção aplicada |
|---|--------|-------------------|
| F3 | Etapa 1 exigia "listar perguntas em aberto" antes de as perguntas existirem | Porta 1.3 agora cobre só os abertos **já conhecidos**. As perguntas novas nascem no **hook**: ao fechar qualquer etapa o app pergunta "que perguntas/decisões novas surgiram?" e grava no Registro Vivo. |
| F4 | 9.5 "conta fecha" dependia de custos (16) e preço (17), 7 etapas depois | **Reordenado**: Custos agora é a etapa 9, Preço é a 10, e o Modelo de Negócio é a 11 — a "conta fecha" (11.5) usa números reais. |
| F5 | Contrato e CNPJ (15) vinham antes do nome (18) | **Reordenado**: Identidade/nome é a etapa 17; Jurídico/societário é a 18. |
| F6 | 2.3 e 2.5 decidiam mérito antes da evidência (etapas 4–5) | 2.3 e 2.5 rebaixadas a **HIPÓTESES**, confirmadas na porta 5.5 com critério numérico. |

## 🟡 Médios (pré-condições não guardadas)

| # | Achado | Correção aplicada |
|---|--------|-------------------|
| F7 | Etapa do piloto mandava prospectar sem pipeline existir | Nova porta **23.5**: "≥20 contatos reais qualificados do público canônico" antes de liberar o piloto. |
| F8 | Caixa/capital nunca era porta | Nova porta **9.5**: runway — caixa cobre ≥6 meses de operação sem receita. |
| F9 | Pessoas eram consumidas mas nunca garantidas | Portas **15.2, 21.3 e 28.5** agora exigem pessoas **reais**, nomeadas e disponíveis — não cargos hipotéticos. |

## 🟢 Baixos (robustez)

| # | Achado | Correção aplicada |
|---|--------|-------------------|
| F10 | Preço com 5 donos e nenhuma fonte de verdade | Painel **Preço Canônico** no app: fonte única, com histórico de versões; o app avisa se alguém tentar mudá-lo fora das etapas 10, 26 e 27. |
| F11 | Validações (5, 8, 20) não garantiam o mesmo público | Porta 3.5 cria o **Público Canônico**; as portas 5.2, 8.5, 10.3 e 20.1 o referenciam explicitamente. |
| F12 | Predicados subjetivos sem critério numérico | Thresholds embutidos nos critérios: ≥6/8 entrevistas (5.5), margem ≥30% (9.4), MVP ≤6 semanas (19.4), decisão ≥70% da meta (26.5), ≤20% horas extras (27.4), ciclo autônomo por 3 meses (30.5). |
| F13 | Contrato de retorno inconsistente (boolean vs string) | Motor do app usa contrato uniforme: `statusEtapa()` sempre retorna `{status: 'ok'|'blocked'|'locked'}`; a etapa 31 é estado permanente de ciclo, não um "retorno especial". |

## Ordem nova vs. ordem original

| Nova | Etapa | Original |
|------|-------|----------|
| 9 | Custos e caixa | 16 |
| 10 | Preço (hipóteses) | 17 |
| 11 | Modelo de negócio | 9 |
| 12–16 | Serviço, Escopo, Jornada, Operação, Dados | 10–14 |
| 17 | Identidade (nome) | 18 |
| 18 | Jurídico e societário | 15 |
| demais | inalteradas | — |

Marcos: **24.2** = primeiro cliente pago · **30.5** = empresa funcionando com clientes.
