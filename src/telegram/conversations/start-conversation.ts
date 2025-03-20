import { createItem } from '@directus/sdk'
import { createConversation } from '@grammyjs/conversations'
import { directus } from '~/directus/client'
import { BotConversation, ConversationContext } from '~/telegram/bot'

export const START_CONVERSATION_KEY = 'start_conversation'

export const startConversation = createConversation(
  async (conversation: BotConversation, ctx: ConversationContext) => {
    if (!ctx.msg?.from || ctx.msg.from.is_bot) {
      return ctx.reply('Invalid sender')
    }

    const telegramId = ctx.msg.from.id
    const telegramName =
      `${ctx.msg.from.first_name ?? ''} ${ctx.msg.from.last_name ?? ''}`.trim()

    // TODO: Check for duplicated user
    await conversation.external(async () => {
      await directus.request(
        createItem('user', {
          id: telegramId,
          name: telegramName,
        })
      )
    })

    await ctx.reply(`Welcome to EGALive Chat Bot, ${telegramName}`)
  },
  START_CONVERSATION_KEY
)
