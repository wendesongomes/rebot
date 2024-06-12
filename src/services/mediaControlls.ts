import { AudioPlayer } from "@discordjs/voice"
import { client } from "../lib/client"
import { next } from "./next";
import { TQueue } from "../server";

export function MediaControlls(player: AudioPlayer, queue: TQueue) {
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

      if(reaction.emoji.name === '⏭️'){
        next(player, queue)
      }

      if(reaction.emoji.name === '🛑'){
        player.stop()
      }
    }
  })
}