import {
  AudioPlayer,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  createAudioResource,
  joinVoiceChannel,
} from '@discordjs/voice'
import { Message } from 'discord.js'
import ytdl from 'ytdl-core'

export async function Music(message: Message, player: AudioPlayer) {
  if (
    message.guildId &&
    message.guild &&
    message.member &&
    message.member.voice.channelId
  ) {
    if (message.content.startsWith('!music')) {
      const link = message.content.split(' ')[1]
      if (!link) {
        return message.reply(
          'Você precisa fornecer um link do YouTube após o comando !music.',
        )
      }

      try {
        const connection = joinVoiceChannel({
          channelId: message.member.voice.channelId,
          guildId: message.guildId,
          adapterCreator: message.guild.voiceAdapterCreator,
        })

        const stream = ytdl(link, {
          filter: 'audioonly',
          quality: 'lowestaudio',
        })
        const resource = createAudioResource(stream)

        player.play(resource)
        connection.subscribe(player)

        player.on(AudioPlayerStatus.Idle, () => {
          connection.destroy()
        })

        connection.on(VoiceConnectionStatus.Disconnected, () => {
          message.reply('Desconectando do canal')
        })

        const title = await ytdl.getInfo(link)
        message
          .reply(`Tocando agora: ${title.videoDetails.title}`)
          .then((msg) => {
            msg.react('⏮️')
            msg.react('▶️')
            msg.react('⏸️')
            msg.react('⏭️')
            msg.react('⭐')
          })
      } catch (err) {
        console.error(err)
        message.reply(
          'Ocorreu um erro ao tentar tocar a música. Verifique se o link está correto e tente novamente.',
        )
      }
    }
  }
}
