import {
  AudioPlayer,
  AudioPlayerStatus,
} from '@discordjs/voice'
import { Message } from 'discord.js'
import ytdl from '@distube/ytdl-core'
import { next } from '../next'
import { TQueue } from '../../server'
import { toSmallText } from '../toSmallText'

export async function Music(message: Message, player: AudioPlayer, queue: TQueue) {
  if (message.guildId && message.guild && message.member) {
    if (message.content.startsWith('!rplay')) {
      const link = message.content.split(' ')[1]

      if (!link || !ytdl.validateURL(link)) {
        return message.reply(toSmallText(`>>> Atenção\nVocê precisa fornecer um link do YouTube para o comando !rplay.`))
      }

      if (!message.member.voice.channelId) {
        return message.reply(toSmallText(`>>> Atenção\nVocê precisa estar em um canal de voz para usar o comando !rplay.`))
      }

      queue.push({ link, message })

      const title = (await ytdl.getInfo(link)).videoDetails.title
      const queueLength = queue.length.toString().padStart(2, '0')

      if (player.state.status !== AudioPlayerStatus.Playing) {
        next(player, queue)
      } else {
        message.reply(toSmallText(`Musica Adicionada\n**${title}**\nMusicas Na Fila\u2003\u2003Posição Na Fila\n**${queueLength}**\u2003\u2003\u2003\u2003\u2003\u2003\u2003 **${queueLength}**`))
      }
    }
  }
}
