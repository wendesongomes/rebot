import { AudioPlayer } from "@discordjs/voice"
import { client } from "../lib/client"

export function Controlls(player: AudioPlayer) {
  client.on('messageReactionAdd', async (reaction, user) => {
    if(user.bot) return
  
    const message = reaction.message
  
    if(message.author?.id === client.user?.id){
      if(reaction.emoji.name === '⏸️'){
        player.pause()
      }
  
      if(reaction.emoji.name === '▶️'){
        player.unpause()
      }

      if(reaction.emoji.name === '🛑'){
        player.stop()
      }
    }
  })
}