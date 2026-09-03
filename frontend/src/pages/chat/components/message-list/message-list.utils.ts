import type { ChatMessage } from '@/services/messages'
import { isOutgoingMessage } from '@/services/messages'
import type { DayBucket } from '@/utils'
import { getDayBucket, getDayKey } from '@/utils'

export interface MessageListItem {
  message: ChatMessage
  isOutgoing: boolean
  /** Primeira mensagem de uma sequencia do mesmo lado da conversa. */
  isSequenceStart: boolean
}

export interface MessageDayGroup {
  dayKey: string
  bucket: DayBucket
  /** Data de referencia do grupo, para o rotulo do separador. */
  isoDate: string
  items: MessageListItem[]
}

/**
 * Quebra a conversa em blocos por dia e marca onde comeca cada sequencia.
 *
 * O lado vem de `isOutgoingMessage` — e nao do `senderId` — porque a
 * mensagem otimista ainda nao tem o id real do remetente; comparar o lado
 * mantem a sequencia continua enquanto o servidor nao responde.
 */
export const groupMessagesByDay = (
  messages: ChatMessage[],
  peerId: string,
): MessageDayGroup[] => {
  const groups: MessageDayGroup[] = []

  messages.forEach((message, index) => {
    const dayKey = getDayKey(message.createdAt)
    const isOutgoing = isOutgoingMessage(message, peerId)

    const previousMessage = messages[index - 1]
    const previousGroup = groups.at(-1)

    const isSequenceStart =
      !previousMessage ||
      isOutgoingMessage(previousMessage, peerId) !== isOutgoing ||
      getDayKey(previousMessage.createdAt) !== dayKey

    const item: MessageListItem = { message, isOutgoing, isSequenceStart }

    if (previousGroup?.dayKey === dayKey) {
      previousGroup.items.push(item)

      return
    }

    groups.push({
      dayKey,
      bucket: getDayBucket(message.createdAt),
      isoDate: message.createdAt,
      items: [item],
    })
  })

  return groups
}
