import { AudioPlayer, AudioPlayerStatus, VoiceConnectionStatus, createAudioResource, joinVoiceChannel } from "@discordjs/voice";
import { Message } from "discord.js";
import ytdl from "ytdl-core";
import { TQueue } from "../server";

export async function next(player: AudioPlayer, queue: TQueue) {
  const { link, message } = queue.shift()!;

  try {
    const connection = joinVoiceChannel({
      channelId: message.member!.voice.channelId!,
      guildId: message.guildId!,
      adapterCreator: message.guild!.voiceAdapterCreator,
    });

    const stream = ytdl(link, {
      filter: 'audioonly',
      quality: 'lowestaudio',
    });
    const resource = createAudioResource(stream);
    const videoInfo = await ytdl.getInfo(link);
    const playingMessage = await message.reply(`Tocando agora: ${videoInfo.videoDetails.title}`);
    await playingMessage.pin();

    player.play(resource);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Idle, async () => {
      await playingMessage.unpin();
      if (queue.length === 0) {
        connection.destroy()
      } else {
        next(player, queue)
      }
    });

    connection.on(VoiceConnectionStatus.Disconnected, async () => {
      await playingMessage.unpin();
      message.reply('Desconectando do canal');
    });

    let timesStamp = parseInt(videoInfo.videoDetails.lengthSeconds);
    let playTime = timesStamp;

    let minutes = (number: number) => Math.floor(number / 60);
    let seconds = (number: number) => number % 60;

    const interval = setInterval(async () => {
      playTime--;

      const editMessage = `
        >>> Tocando agora: **${videoInfo.videoDetails.title}** \nTempo De Video: **${minutes(timesStamp)} Minutos e ${seconds(timesStamp)} segundos**  Tempo Restante: **${minutes(playTime)} Minutos e ${seconds(playTime)} segundos**
      `;

      await playingMessage.edit(editMessage);

      if (playTime <= 0) {
        clearInterval(interval);
        await playingMessage.unpin();
        await playingMessage.edit(`~~${editMessage}~~`);
      }
    }, 1000);

    await playingMessage.react('⏮️');
    await playingMessage.react('▶️');
    await playingMessage.react('⏸️');
    await playingMessage.react('⏭️');
    await playingMessage.react('🛑');
  } catch (err) {
    console.error(err);
    message.reply(
      'Ocorreu um erro ao tentar tocar a música. Verifique se o link está correto e tente novamente.',
    );
  }
}