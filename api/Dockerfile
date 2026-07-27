# Serviço de IA (assistente Setfree). Sem dependências → imagem mínima.
FROM node:22-alpine
WORKDIR /app
COPY server.mjs ./
ENV PORT=8787
EXPOSE 8787
USER node
CMD ["node", "server.mjs"]
