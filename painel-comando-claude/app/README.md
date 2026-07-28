# Criador de Prompt — app com IA ao vivo (v1.1)

Aplicativo hospedado por você (frontend + backend) que monta prompts do Claude com **IA
ao vivo**: a partir do seu **objetivo**, a IA entende o pedido, **sugere ferramentas do
seu inventário real**, faz as **perguntas que faltam** (uma por tela) e, no fim, monta o
prompt final com um **loop juiz embutido** (a IA critica e melhora o próprio resultado).

> É a **Fase 2** do projeto. Diferente da v1 (que roda como página estática/artifact),
> aqui a IA roda de verdade, então precisa de um **servidor com sua chave da API** e de
> um **deploy**. A chave fica **só no servidor**, nunca no navegador.

## O que tem dentro
```
app/
├── server.js            # backend Node (guarda a chave, chama a API do Claude)
├── inventory.json       # "o que posso usar" — a IA só sugere daqui (edite à vontade)
├── public/index.html    # o assistente ao vivo (frontend)
├── package.json         # dependências (@anthropic-ai/sdk, express)
├── Dockerfile           # imagem para deploy
├── docker-compose.yml   # sobe o app com uma variável de ambiente
├── .env.example         # modelo das variáveis (copie para .env)
└── .dockerignore
```

## As 3 rotas de IA (backend)
- `POST /api/plan` → a IA lê o objetivo + o inventário e devolve: o que **entendeu**, as
  **ferramentas sugeridas** e as **perguntas** dela (para tirar as próprias dúvidas).
- `POST /api/compose` → monta o prompt e roda o **loop juiz** numa só chamada; devolve o
  **prompt final** + a lista do que o juiz melhorou.
- `GET /api/inventory` → devolve o inventário (a tela "O que posso usar?").

## Rodar no seu computador (teste rápido)
Pré-requisito: Node 20+.
```bash
cd app
cp .env.example .env         # e cole sua chave em ANTHROPIC_API_KEY
npm install
npm start                    # abre em http://localhost:8080
```

## Publicar no Dokploy (deploy)
1. Aponte o Dokploy para este repositório, pasta `painel-comando-claude/app` (usa o
   `Dockerfile` / `docker-compose.yml`).
2. Em **Environment**, defina:
   - `ANTHROPIC_API_KEY` = sua chave (obrigatório)
   - `MODEL` = `claude-opus-5` (ou `claude-sonnet-5` para gastar menos) — opcional
3. Deploy. A porta interna é **8080**.
4. `GET /health` responde `{ ok: true, temKey: true }` quando a chave está configurada.

## Coisas importantes
- **Custo:** cada montagem faz 2 chamadas à API (planejar + compor). O modelo padrão é
  o `claude-opus-5`; troque para `claude-sonnet-5` no `MODEL` se quiser reduzir o gasto.
- **Segurança:** a chave fica só no servidor (variável de ambiente). O `.env` real
  **não** vai para o Git (está no `.dockerignore`).
- **Inventário:** edite `inventory.json` para refletir o que você realmente tem
  instalado/conectado — a IA só sugere itens dessa lista.

## O que ainda não está aqui (próximos passos)
- Executar o prompt final de verdade (hoje ele é entregue para você copiar).
- Login/usuários e histórico de prompts.
- Conectar os apps (Gmail/Drive…) para a IA ler dados reais durante a montagem.
