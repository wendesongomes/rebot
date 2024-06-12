import { env } from './lib/env'
import { NoSubscriberBehavior, createAudioPlayer } from '@discordjs/voice'
import { client } from './lib/client'
import { Controlls } from './services/controlls'
import { Music } from './services/commands/music'
import { Message } from 'discord.js'

export type TQueue = { link: string; message: Message }[]
const queue: TQueue = [];

client.on('ready', () => {
  console.log('Ready!')
})

const player = createAudioPlayer({
  behaviors: {
    noSubscriber: NoSubscriberBehavior.Pause,
    maxMissedFrames: 100,
  }
})

Controlls(player, queue)

client.on('messageCreate', async (message) => {
  Music(message, player, queue)
})

client.login(env.DISCORD_TOKEN)
