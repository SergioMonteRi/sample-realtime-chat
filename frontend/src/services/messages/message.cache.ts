import type { QueryClient } from '@tanstack/react-query'

import { messageQueries } from './message.queries'
import type { ChatMessage } from './message.types'
import {
  isOptimisticMessage,
  OUTGOING_SENDER_ID,
  toSentMessage,
} from './message.utils'

/**
 * Datas vem em formatos diferentes (o backend serializa com microssegundos,
 * a mensagem otimista usa `toISOString`), entao a ordenacao compara o
 * instante — nunca a string. `sort` e estavel: empate mantem a ordem de
 * chegada.
 */
const byChronology = (first: ChatMessage, second: ChatMessage): number =>
  new Date(first.createdAt).getTime() - new Date(second.createdAt).getTime()

export const insertMessage = (
  messages: ChatMessage[],
  message: ChatMessage,
): ChatMessage[] => {
  const hasMessage = messages.some((current) => current.id === message.id)

  if (hasMessage) return messages

  return [...messages, message].sort(byChronology)
}

export const replaceMessage = (
  messages: ChatMessage[],
  targetId: string,
  message: ChatMessage,
): ChatMessage[] =>
  messages
    .map((current) => (current.id === targetId ? message : current))
    .sort(byChronology)

/**
 * Porta de entrada de uma mensagem que a aplicacao nao pediu.
 *
 * Hoje so o `POST` passa por aqui. Quando o Socket.IO entrar, o handler do
 * evento `new-message` chama esta mesma funcao: a mensagem e escrita na
 * `queryKey` que a tela ja observa, e a origem do dado (HTTP ou canal)
 * continua invisivel para a UI. Ver `services/realtime`.
 */
export const applyIncomingMessage = (
  queryClient: QueryClient,
  message: ChatMessage,
): void => {
  const { queryKey } = messageQueries.byChat(message.chatId)

  queryClient.setQueryData(queryKey, (current) => {
    const messages = current ?? []

    const optimisticMessage = messages.find(
      (current) =>
        isOptimisticMessage(current) &&
        current.senderId === OUTGOING_SENDER_ID &&
        current.content === message.content,
    )

    if (optimisticMessage) {
      return replaceMessage(
        messages,
        optimisticMessage.id,
        toSentMessage(message),
      )
    }

    return insertMessage(messages, message)
  })
}
