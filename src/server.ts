import { Client, GatewayIntentBits } from "discord.js"
import { env } from "./lib/env"
import { AudioPlayerStatus, VoiceConnectionStatus, createAudioPlayer, createAudioResource, joinVoiceChannel } from "@discordjs/voice"
import ytdl from "ytdl-core"

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ]
})

client.on("ready", () => {
  console.log('Ready!')
})

client.on('messageCreate', async (message) => {
  if (message.content.startsWith('!music')) {
    if (message.guildId && message.guild && message.member && message.member.voice.channelId) {
      const link = message.content.split(' ')[1];
      
      if (!link) {
        return message.reply('Você precisa fornecer um link do YouTube após o comando !music.');
      }

      try {
        const connection = joinVoiceChannel({
          channelId: message.member.voice.channelId,
          guildId: message.guildId,
          adapterCreator: message.guild.voiceAdapterCreator,
        });

        const player = createAudioPlayer();
        const stream = ytdl(link, {
          filter: 'audioonly',
          quality: 'lowestaudio'
        });
        console.log(stream.toArray)
        const resource = createAudioResource(stream);

        player.play(resource);
        connection.subscribe(player);

        player.on(AudioPlayerStatus.Idle, () => {
          connection.destroy();
        });

        connection.on(VoiceConnectionStatus.Disconnected, () => {
          message.reply('Desconectando do canal');
        });

        message.reply('Now playing!');
      } catch (err) {
        console.error(err);
        message.reply('Ocorreu um erro ao tentar tocar a música. Verifique se o link está correto e tente novamente.');
      }
    } else {
      message.reply('Você precisa estar em um canal de voz primeiro!');
    }
  }
})

client.login(env.DISCORD_TOKEN)