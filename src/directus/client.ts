import { createDirectus, rest, staticToken } from '@directus/sdk'
import { appEnv } from '~/app-env'

export const directus = createDirectus(appEnv.DIRECTUS_URL)
  .with(staticToken(appEnv.DIRECTUS_TOKEN))
  .with(rest())
