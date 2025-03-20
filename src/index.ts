import { Elysia } from 'elysia'
import { bot } from '~/telegram/bot'

export const elysiaApp = new Elysia()
  .get('/', () => 'Hello there ✋')
  .listen(3000)

console.log(
  `🦊 Elysia is running at ${elysiaApp.server?.hostname}:${elysiaApp.server?.port}`
)

bot.start()
