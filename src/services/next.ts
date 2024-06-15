import { AudioPlayer, AudioPlayerStatus, VoiceConnectionStatus, createAudioResource, joinVoiceChannel } from "@discordjs/voice"
import ytdl from "@distube/ytdl-core"
import { TQueue } from "../server"
import { toSmallText } from "./toSmallText"


export async function next(player: AudioPlayer, queue: TQueue, start?: number) {
  const { link, message } = queue.shift()!

  try {
    const connection = joinVoiceChannel({
      channelId: message.member!.voice.channelId!,
      guildId: message.guildId!,
      adapterCreator: message.guild!.voiceAdapterCreator,
    })

    const stream = ytdl(link, {
      filter: 'audioonly',
      quality: 'lowestaudio',
      range: { start }
    })
    
    const resource = createAudioResource(stream)
    const videoInfo = await ytdl.getInfo(link)
    let nextVideoInfo = await getNextVideoTitle(queue)
    let timesStamp = parseInt(videoInfo.videoDetails.lengthSeconds)
    let playTime = timesStamp

    const playingMessage = await message.channel.send(await templateMessage(videoInfo, timesStamp, playTime, queue, nextVideoInfo))
    await playingMessage.pin()

    player.play(resource)
    connection.subscribe(player)

    player.on(AudioPlayerStatus.Idle, async () => {
      await playingMessage.unpin()
      if (queue.length === 0) {
        connection.destroy()
      } else {
        next(player, queue)
      }
    })

    connection.on(VoiceConnectionStatus.Disconnected, async () => {
      await playingMessage.unpin()
      message.reply('Desconectando do canal')
    })
    const interval = setInterval(async () => {
      playTime--

      nextVideoInfo = await getNextVideoTitle(queue) 
      await playingMessage.edit(await templateMessage(videoInfo, timesStamp, playTime, queue, nextVideoInfo))

      if (playTime <= 0) {
        clearInterval(interval)
        await playingMessage.unpin()
        await playingMessage.edit(`~~${await templateMessage(videoInfo, timesStamp, playTime, queue, nextVideoInfo)}~~`)
      }
    }, 1000)

    await playingMessage.react('▶️')
    await playingMessage.react('⏸️')
    await playingMessage.react('⏭️')
    await playingMessage.react('🛑')
  } catch (err) {
    console.error(err)
    message.reply(
      'Ocorreu um erro ao tentar tocar a música. Verifique se o link está correto e tente novamente.',
    )
  }
}

async function getNextVideoTitle(queue: TQueue): Promise<string> {
  return queue.length > 0 ? (await ytdl.getInfo(queue[0].link)).videoDetails.title : 'Nenhuma musica';
}


async function templateMessage(actuallyPlaying: ytdl.videoInfo, timesStamp: number, playTime: number, queue: TQueue, nextVideoExist: string) {
  let minutes = (number: number) => Math.floor(number / 60).toString().padStart(2, '0')
  let seconds = (number: number) => (number % 60).toString().padStart(2, '0')
  const title = actuallyPlaying.videoDetails.title
  const actuallyTimeStamp = `${minutes(timesStamp)}:${seconds(timesStamp)}`
  const playTimeStamp = `${minutes(playTime)}:${seconds(playTime)}`

  return toSmallText(`>>> Tocando Agora\nMusica\n**${title}**\nTempo\u2003\u2003Duração\u2003\u2003Lista\n**${actuallyTimeStamp}**\u2003\u2003**${playTimeStamp}**\u2003\u2003\u2003**${queue.length}**\nProxima Musica\n**${nextVideoExist}**`)
}