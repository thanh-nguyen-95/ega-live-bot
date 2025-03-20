import { directus } from '~/directus/client'
import { schemaApply, schemaDiff } from '@directus/sdk'

async function main() {
  const snapshot = await Bun.file('./scripts/snapshot.json').text()
  const isForced = true
  const diff = await directus.request(
    schemaDiff(JSON.parse(snapshot), isForced)
  )

  await directus.request(schemaApply(diff))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
