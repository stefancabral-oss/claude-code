# Glossário — em português claro

Sem decoreba. Só o suficiente para entender o painel.

### Prompt
O "pedido" que você faz ao Claude em texto. O painel escreve isso por você.

### Skill (habilidade)
Uma **receita** que ensina o Claude a fazer **uma tarefa específica** bem feita —
com o passo a passo já embutido. Ex.: *analisar um edital*, *fazer triagem de
e-mails*, *cobrar uma fatura*. No painel, cada skill vira um **botão de ação**.

### Plugin
Um **pacote** que traz várias skills e comandos de um mesmo assunto, tudo junto.
Instalar um plugin é como instalar um app que já vem com vários recursos. Ex.:
o plugin `small-business` traz 15 skills de gestão (caixa, cobrança, folha...).

### Conector (MCP / API)
A **tomada** que liga o Claude a um programa externo (Gmail, Google Drive, Notion,
Outlook...) para **ler ou escrever dados** de verdade. Sem conector, o Claude só
"conversa"; com conector, ele consegue *buscar seu e-mail* ou *ler uma planilha*.
- **MCP** é o "padrão de encaixe" desses conectores (o formato da tomada).
- **API** é o jeito técnico de um programa falar com outro.

### Comando / Workflow
Um **atalho** (começa com `/`) que dispara uma sequência de skills. Ex.:
`/monday-brief` monta seu resumo de segunda-feira. No painel, viram **combos**.

### Front-end
A parte que você **vê e clica** (a tela com botões), aberta no navegador.

### Back-end
A parte **escondida** (o servidor) que guarda o catálogo e, na Fase 2, conversa
com o Claude. É onde a chave de API fica guardada com segurança.

### Chave de API
Uma **senha** que autoriza o painel a usar o Claude pago por conta. Fica só no
back-end, nunca no navegador nem no GitHub. Só entra em cena na Fase 2.

### Deploy
**Publicar** o painel para ficar acessível por um link na internet (ex.: via
Dokploy, a ferramenta de publicação que este projeto já usa).

### Catálogo
O arquivo (`catalogo-inicial.json`) com a lista dos seus botões. É o "cérebro":
o painel lê esse arquivo e desenha os botões a partir dele.
