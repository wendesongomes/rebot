import { env } from './lib/env'
import { createAudioPlayer } from '@discordjs/voice'
import { client } from './lib/client'
import { Controlls } from './services/controlls'
import { Music } from './services/commands/music'

client.on('ready', () => {
  console.log('Ready!')
})

const player = createAudioPlayer()

Controlls(player)

client.on('messageCreate', async (message) => {
  Music(message, player)
})

client.login(env.DISCORD_TOKEN)
