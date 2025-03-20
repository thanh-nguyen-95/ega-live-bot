import { z } from 'zod'

export const appEnv = z
  .object({
    TELEGRAM_BOT_TOKEN: z.string().min(1),
    DIRECTUS_URL: z.string().url(),
    DIRECTUS_TOKEN: z.string().min(1),
    GEMINI_API_KEY: z.string().min(1),
    GEMINI_MODEL: z.string().min(1),
  })
  .parse(process.env)
