FROM node:20-alpine
WORKDIR /app

# Instala dependencias primeiro (cache de build)
COPY package.json ./
RUN npm install --omit=dev

# Copia o resto do app
COPY server.js inventory.json ./
COPY public ./public

ENV PORT=8080
EXPOSE 8080

# Healthcheck: o Dokploy/Docker marca o container saudavel quando /health responde.
HEALTHCHECK --interval=30s --timeout=4s --start-period=15s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT}/health" >/dev/null 2>&1 || exit 1

CMD ["node", "server.js"]
