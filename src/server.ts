import { env } from './lib/env'
import { NoSubscriberBehavior, createAudioPlayer } from '@discordjs/voice'
import { client } from './lib/client'
import { Music } from './services/commands/music'
import { ActivityType, Message } from 'discord.js'
import { gracefulShutdown } from './services/gracefulShutdown'
import { MediaControlls } from './services/mediaControlls'

export type TQueue = { link: string; message: Message }[]
const queue: TQueue = [];

client.on('ready', () => {
  console.log('Ready!')

    client.user?.setPresence({
    activities: [{
      name: 'musicas | !rplay <link>',
      type: ActivityType.Listening,
    }],
    status: 'online',
  })
})

const player = createAudioPlayer({
  behaviors: {
    noSubscriber: NoSubscriberBehavior.Pause,
    maxMissedFrames: 100,
  }
})

MediaControlls(player, queue)

process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)

client.on('messageCreate', async (message) => {
  Music(message, player, queue)
})

client.login(env.DISCORD_TOKEN)