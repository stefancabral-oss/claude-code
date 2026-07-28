# Criador de Prompt — app com 3 modos de interação (v1.2)

Aplicativo hospedado por você (frontend + backend) que monta prompts do Claude. A tela
inicial oferece **três modos de interação** — você escolhe como quer trabalhar:

| Modo | O que é | Precisa de IA/servidor? |
|------|---------|-------------------------|
| ✍️ **Analógico** | Escrever livre, texto puro, como no papel. Um botão "Inserir modelo" dá um esqueleto para preencher à mão. | Não — roda no navegador |
| 🧱 **Digital** | Montar **por partes**, passo a passo (objetivo → estilo → detalhes → como executar → formato → conferir). O sistema encaixa tudo numa frase, de forma **determinística**. | Não — roda no navegador |
| 🤖 **Inteligente** | A **IA ao vivo** entende o pedido, **sugere ferramentas do inventário real**, faz as **perguntas que faltam** (uma por tela) e monta o prompt com **loop juiz embutido**. | Sim — usa o backend + sua chave |

Só o modo **Inteligente** depende da API do Claude; os modos **Analógico** e **Digital**
funcionam mesmo sem chave configurada.

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
Passo a passo completo, com o caminho exato de cliques, em **[`DEPLOY.md`](./DEPLOY.md)**.

Resumo: crie uma **Application** no Dokploy apontando para o repositório, **Build Type
Dockerfile**, **Build Path `app`**, porta **8080**, e as variáveis `ANTHROPIC_API_KEY`
(obrigatória) e `MODEL` (opcional, padrão `claude-opus-5`). `GET /health` responde
`{ ok: true, temKey: true }` quando a chave está configurada.

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
