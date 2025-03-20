// NOTE: The actual maximum message length is 4000 but we want to be safe here
export const TELEGRAM_MAX_MESSAGE_LENGTH = 3750

export function escapeTelegramHTML(str: string) {
  return str.replace(/&<>/g, (match) => {
    switch (match) {
      case '&':
        return '&amp;'
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      default:
        return match
    }
  })
}

export function chunkTelegramMessage(
  message: string,
  maxLength = TELEGRAM_MAX_MESSAGE_LENGTH
) {
  const chunks: string[] = []

  const lines = message.split('\n')

  let currentChunk = ''

  for (const line of lines) {
    if (!line) {
      currentChunk = currentChunk.concat('\n')
      continue
    }

    const nextChunk = currentChunk.concat(line)

    if (nextChunk.length < maxLength) {
      currentChunk = currentChunk.concat('\n', line)
      continue
    }

    if (currentChunk.length > 0) {
      chunks.push(currentChunk)
    }

    currentChunk = line
  }

  chunks.push(currentChunk)

  return chunks
}
