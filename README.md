![Untitled-1](https://github.com/wendesongomes/rebot/assets/82889172/e1e9df27-8a14-454b-8b77-9127bb22ed13)

# Rebot - Um bot de musica (OpenSource)

Este projeto surgiu a partir de uma conversa com amigos, onde mencionaram que muitos bots de música para Discord estavam parando de funcionar. Como desenvolvedor, fiquei curioso sobre como criar um bot de música para Discord e decidi enfrentar o desafio. Consegui fazer um bot funcional que já consegue entrar em uma sala e tocar música. Ainda há muito a ser aprimorado, mas estou animado com o progresso até agora.

- [x]  - Entrar na sala
- [x]  - Tocar Musica
- [x]  - Criar controles de musica
- [x]  - Criar uma fila de musicas
- [ ]  - Tocar Playlist do youtube completa
- [ ]  - Tocar musica do spotify

## Bugs Conhecidos

Aqui estão alguns bugs que estou ciente e trabalhando para resolver:

1. **Interrupção aleatória da reprodução de música**: Às vezes, o bot reproduz a música sem problemas, mas em outras ocasiões, ele para no início ou na metade da música. Nesses casos, é necessário reiniciar o bot para que ele volte a funcionar corretamente.

## Tecnologias Utilizadas.

- `discord.js`
- `@discordjs/voice`
- `libsodium-wrappers`
- `@distube/ytdl-core`
- `zod`
- `@types/node`
- `tsx`
- `typescript`

## Requisitos

- `nodejs`
- `npm`

## Instalação

1. Clone o repositório:
```sh
git clone https://github.com/wendesongomes/BotMusicDiscord.git
cd BotMusicDiscord
```

2. Instale as dependências:
```sh
npm install
```

3. Crie uma aplicação no [site do Discord](https://discord.com/developers/applications) e obtenha o token.

4. Crie um arquivo .env na raiz do projeto e adicione seu token:
```
DISCORD_TOKEN=seu_token_aqui
```

## Uso

1. Inicie o bot:

```sh
npm run dev
```

2. Convide o bot para o seu servidor usando o link gerado na página de desenvolvimento do Discord.

3. Use o comando `!rplay <link>` para iniciar uma musica.

