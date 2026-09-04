import type { QueryClient } from '@tanstack/react-query'

import { messageQueries } from './message.queries'
import type { ChatMessage } from './message.types'
import { isOptimisticMessage, toSentMessage } from './message.utils'

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
 * Encerra o ciclo de vida de uma mensagem otimista.
 *
 * Troca o balao pendente pela mensagem do servidor — ou insere, se o balao
 * nao estiver mais la. Isso acontece de verdade: numa conversa recem-criada,
 * o primeiro `GET /messages` pode chegar entre o envio e a resposta e levar
 * o balao embora. Sem esse `insert` de reserva, a mensagem sumiria da tela
 * ate o proximo refetch.
 */
export const settleMessage = (
  messages: ChatMessage[],
  optimisticId: string,
  message: ChatMessage,
): ChatMessage[] =>
  messages.some((current) => current.id === optimisticId)
    ? replaceMessage(messages, optimisticId, message)
    : insertMessage(messages, message)

/**
 * Porta de entrada de uma mensagem que a aplicacao nao pediu — o evento
 * `new-message` do canal (ver `use-chat-realtime`).
 *
 * A mensagem e escrita na `queryKey` que a tela ja observa, entao a origem
 * do dado fica invisivel para a UI: o mesmo caminho de render serve para uma
 * resposta HTTP e para um evento do socket.
 *
 * Quem envia tambem recebe o broadcast da propria mensagem. Se o `POST`
 * ainda nao respondeu, e o balao otimista que e trocado aqui; se ja
 * respondeu, `insertMessage` reconhece o id e nao duplica.
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
        current.senderId === message.senderId &&
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
