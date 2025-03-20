import { schemaSnapshot } from '@directus/sdk'
import { directus } from '~/directus/client'

async function main() {
  const schema = await directus.request(schemaSnapshot())

  Bun.write('./scripts/snapshot.json', JSON.stringify(schema, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
