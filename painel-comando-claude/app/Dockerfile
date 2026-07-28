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
CMD ["node", "server.js"]
