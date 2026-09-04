import type { QueryClient } from '@tanstack/react-query'

import type { Message } from '../messages/message.types'
import { chatKeys } from './chat.queries'
import type { Chat } from './chat.types'

/**
 * A mesma ordem do `ORDER BY` do backend: por atividade, e a conversa sem
 * mensagem no fim. Precisa espelhar, porque a lista e reordenada aqui sem
 * ida ao servidor — se as duas ordens divergirem, a barra lateral pula de
 * posicao no proximo refetch.
 */
const byActivity = (first: Chat, second: Chat): number => {
  if (first.lastMessageAt && second.lastMessageAt) {
    return (
      new Date(second.lastMessageAt).getTime() -
      new Date(first.lastMessageAt).getTime()
    )
  }

  if (first.lastMessageAt) return -1
  if (second.lastMessageAt) return 1

  return (
    new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()
  )
}

/**
 * Registra que uma conversa acabou de se mover: atualiza a previa, a hora e
 * recoloca a conversa no topo.
 *
 * E uma escrita no cache, nao um refetch: a barra lateral se reordena no
 * mesmo frame da mensagem, sem uma requisicao por mensagem recebida.
 */
export const applyChatActivity = (
  queryClient: QueryClient,
  message: Message,
): void => {
  const chatId = message.chatId
  const chats = queryClient.getQueryData<Chat[]>(chatKeys.list())

  /**
   * Conversa que ainda nao esta na lista — a que acabou de ser criada no
   * primeiro envio. Aqui falta o participante, entao so o servidor sabe
   * montar a linha inteira.
   */
  if (!chats?.some((chat) => chat.id === chatId)) {
    void queryClient.invalidateQueries({ queryKey: chatKeys.list() })
    return
  }

  queryClient.setQueryData<Chat[]>(chatKeys.list(), (current) =>
    (current ?? [])
      .map((chat) =>
        chat.id === chatId
          ? { ...chat, lastMessageAt: message.createdAt, lastMessage: message }
          : chat,
      )
      .sort(byActivity),
  )
}
