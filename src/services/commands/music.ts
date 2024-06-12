import {
  AudioPlayer,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  createAudioResource,
  joinVoiceChannel,
} from '@discordjs/voice'
import { Message } from 'discord.js'
import ytdl from 'ytdl-core'
import { next } from '../next'
import { TQueue } from '../../server'

export async function Music(message: Message, player: AudioPlayer, queue: TQueue) {
  if (message.guildId && message.guild && message.member) {
    if (message.content.startsWith('!music')) {
      const link = message.content.split(' ')[1]

      if (!link || !ytdl.validateURL(link)) {
        return message.reply(
          'Você precisa fornecer um link do YouTube após o comando !music.',
        )
      }

      if (!message.member.voice.channelId) {
        return message.reply('Você precisa estar em um canal de voz para usar o comando !music.')
      }

      queue.push({ link, message })

      const videoInfo = await ytdl.getInfo(link)

      if (player.state.status !== AudioPlayerStatus.Playing) {
        next(player, queue)
      } else {
        message.reply(`A musica ${videoInfo.videoDetails.title} foi adicionada a fila. \n A fila tem ${queue.length} musicas, A sua musica esta na posicao ${queue.length + 1}.`)
      }
    }
  }
}
