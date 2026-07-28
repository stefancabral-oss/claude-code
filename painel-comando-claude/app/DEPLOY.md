# Deploy no Dokploy — passo a passo

Este guia publica a pasta `app/` (o Criador de Prompt com IA) como um serviço no Dokploy.
O resultado é um **link privado** que roda a IA ao vivo (modos Analógico e Digital funcionam
mesmo sem chave; o modo Inteligente usa a chave da API).

> Pré-requisitos: o projeto já está no GitHub em `stefancabral-oss/promptbotao`, e você tem
> uma **chave da API do Claude** (console.anthropic.com → API Keys).

---

## Opção A — Aplicação por Dockerfile (recomendada)

1. **Dokploy → Projects → Create Project** (ex.: nome `promptbotao`).
2. Dentro do projeto: **Create Service → Application**.
3. **Source / Provider:** GitHub → selecione o repositório **`stefancabral-oss/promptbotao`**,
   branch **`main`**.
   - Se o Dokploy pedir para instalar o app do GitHub, autorize o acesso a esse repositório.
4. **Build:**
   - **Build Type:** `Dockerfile`
   - **Build Path / Context:** `app`  ← (importante: o app está nessa subpasta)
   - **Dockerfile Path:** `Dockerfile` (dentro de `app`)
5. **Environment (variáveis):**
   ```
   ANTHROPIC_API_KEY = (cole sua chave da Anthropic)
   MODEL = claude-opus-5
   PORT = 8080
   ```
   > `MODEL` é opcional — troque para `claude-sonnet-5` se quiser gastar menos.
6. **Networking / Port:** porta do container = **8080** (o Dokploy/Traefik cuida do HTTPS).
7. **Domains:** adicione um domínio/subdomínio (ex.: `prompt.suaempresa.com.br`) ou use o
   domínio automático que o Dokploy oferece. Ative **HTTPS/SSL**.
8. **Deploy.** Aguarde o build e o start.
9. **Verifique:** abra `https://SEU-DOMINIO/health` → deve responder
   `{ "ok": true, "temKey": true }`. Depois abra a raiz `https://SEU-DOMINIO/`.

---

## Opção B — Docker Compose

Se preferir o tipo **Compose**:
1. **Create Service → Compose**, apontando para o repositório e branch `main`.
2. **Compose Path:** `app/docker-compose.yml`.
3. Em **Environment**, defina `ANTHROPIC_API_KEY` (e opcionalmente `MODEL`).
4. Deploy. A porta interna é `8080`; ajuste o domínio/SSL no Dokploy.

---

## Depois do deploy

- **Atualizar o app:** faça `git push` para `main` no `promptbotao` → no Dokploy clique
  **Redeploy** (ou ative *Auto Deploy* para publicar a cada push).
- **Trocar de modelo:** mude a variável `MODEL` e faça Redeploy.
- **Custo:** cada montagem no modo Inteligente faz 2 chamadas à API (planejar + compor com
  loop juiz). `claude-sonnet-5` reduz o gasto.
- **Segurança:** a chave fica só nas variáveis do servidor (nunca no navegador nem no Git).

## Se algo falhar
- Build quebrou? Confirme **Build Path = `app`**.
- Abre mas o modo Inteligente dá erro de chave? `GET /health` mostra `temKey: false` →
  a variável `ANTHROPIC_API_KEY` não chegou; confira em Environment e faça Redeploy.
- 502/timeout logo após o deploy? Aguarde o healthcheck (start-period ~15s) e recarregue.
