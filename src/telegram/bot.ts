import { Bot, Context, GrammyError, HttpError } from 'grammy'
import {
  Conversation,
  ConversationData,
  ConversationFlavor,
  ConversationStorage,
  conversations,
} from '@grammyjs/conversations'
import { appEnv } from '~/app-env'
import {
  START_CONVERSATION_KEY,
  startConversation,
} from './conversations/start-conversation'

export type BotContext = ConversationFlavor<Context>
export type ConversationContext = Context
export type BotConversation = Conversation<BotContext, ConversationContext>
export type BotConversationStorage = ConversationStorage<
  Context,
  ConversationData
>

export const bot = new Bot<BotContext>(appEnv.TELEGRAM_BOT_TOKEN)
/*
 * Plugins
 *
 * */
bot.use(conversations())

/*
 * Conversations
 *
 * */
bot.use(startConversation)

/*
 * Commands
 *
 * */
bot.command('start', async (ctx) => {
  return await ctx.conversation.enter(START_CONVERSATION_KEY)
})

bot.api.setMyCommands([
  {
    command: 'start',
    description: 'Sign up to use the bot',
  },
])

/*
 * Error handlers
 *
 * */
bot.catch(async (exception) => {
  const { ctx } = exception
  console.error(`Error while handling update ${ctx.update.update_id}:`)

  const e = exception.error

  if (e instanceof GrammyError) {
    console.error('Error in request:', e.description)
  } else if (e instanceof HttpError) {
    console.error('Could not contact Telegram:', e)
  } else {
    console.error('Unknown error:', e)
  }

  return
})
