import { createConversation } from '@grammyjs/conversations'
import { BotConversation, ConversationContext } from '~/telegram/bot'

export const START_CONVERSATION_KEY = 'start_conversation'

export const startConversation = createConversation(
  async (_: BotConversation, ctx: ConversationContext) => {
    await ctx.reply(`Welcome to EGALive Chat Bot`)
  },
  START_CONVERSATION_KEY
)
