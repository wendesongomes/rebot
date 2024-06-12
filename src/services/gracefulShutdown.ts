import { AudioPlayer } from "@discordjs/voice";
import { Client } from "discord.js";

export async function gracefulShutdown(client: Client, player: AudioPlayer) {
  console.log('Starting graceful shutdown...')
  
  client.destroy()
  client.removeAllListeners('messageCreate')
  
  player.stop()
  
  await client.destroy()
  
  console.log('Graceful shutdown completed.')
  process.exit(0)
}