# Use uma imagem base que já tenha Node.js e npm
FROM node:18

# Instale ffmpeg
RUN apt-get update && \
    apt-get install -y ffmpeg

# Crie um diretório para o aplicativo
WORKDIR /app

# Copie o package.json e o package-lock.json (ou yarn.lock)
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante do código do bot
COPY . .

# Compile o TypeScript para JavaScript
RUN npm run build

# Defina o comando para iniciar o bot
CMD ["node", "dist/server.js"]
