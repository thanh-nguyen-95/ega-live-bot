import { createItem, readItem, readItems, updateItem } from '@directus/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createConversation } from '@grammyjs/conversations'
import { appEnv } from '~/app-env'
import { directus } from '~/directus/client'
import { BotConversation, ConversationContext } from '~/telegram/bot'
import { chunkTelegramMessage } from '../utils'

export const START_CONVERSATION_KEY = 'start_conversation'

export const startConversation = createConversation(
  async (conversation: BotConversation, ctx: ConversationContext) => {
    if (!ctx.msg?.from || ctx.msg.from.is_bot) {
      return ctx.reply('Invalid sender')
    }

    const telegramId = ctx.msg.from.id.toString()
    const telegramName =
      `${ctx.msg.from.first_name ?? ''} ${ctx.msg.from.last_name ?? ''}`.trim()

    await conversation.external(async () => {
      try {
        return await directus.request(readItem('user', telegramId))
      } catch {
        return await directus.request(
          createItem('user', {
            id: telegramId,
            name: telegramName,
            chats: [{ name: telegramName, history: [] }],
          })
        )
      }
    })

    await ctx.reply(
      `Hello, ${telegramName}. What would you like to chat about?`
    )

    const genAI = new GoogleGenerativeAI(appEnv.GEMINI_API_KEY)

    const model = genAI.getGenerativeModel({
      model: appEnv.GEMINI_MODEL,
    })

    while (true) {
      const message = (await conversation.form.text()).trim()

      if (message.toLowerCase() === 'quit') {
        await ctx.reply('Bye!')
        return
      }

      const oldChat = await conversation.external(async () => {
        const firstChat = await directus.request(
          readItems('chat', {
            filter: {
              user_id: {
                _eq: telegramId,
              },
            },
            limit: 1,
          })
        )

        return firstChat[0]
      })

      const aiChat = model.startChat({
        history: oldChat.history.map((line: [string, string]) => {
          const [role, text] = line

          return {
            role,
            parts: [{ text }],
          }
        }),
      })

      const aiResponse = await conversation.external(async () => {
        const result = await aiChat.sendMessage(message)
        return result.response.text()
      })

      const telegramMessageChunks = chunkTelegramMessage(aiResponse)

      for (const chunk of telegramMessageChunks) {
        await ctx.reply(chunk)
      }

      await conversation.external(async () => {
        await directus.request(
          updateItem('chat', oldChat.id, {
            history: oldChat.history.concat([
              ['user', message],
              ['model', aiResponse],
            ]),
          })
        )
      })
    }
  },
  START_CONVERSATION_KEY
)
