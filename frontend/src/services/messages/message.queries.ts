import { queryOptions } from '@tanstack/react-query'

import { APP } from '@/constants'
import { isUnauthorizedError } from '@/services/http'

import { messageService } from './message.service'
import { toSentMessage } from './message.utils'

export const messageKeys = {
  all: ['messages'] as const,
  byChat: (chatId: string) => [...messageKeys.all, chatId] as const,
}

export const messageQueries = {
  /**
   * Historico da conversa. Sem canal em tempo real, a revalidacao acontece
   * ao voltar o foco para a janela ou pelo botao de atualizar do cabecalho
   * — nao ha polling em segundo plano de proposito: e o lugar exato onde o
   * Socket.IO entra depois.
   */
  byChat: (chatId: string) =>
    queryOptions({
      queryKey: messageKeys.byChat(chatId),
      queryFn: async () => {
        const messages = await messageService.getMessages(chatId)

        return messages.map(toSentMessage)
      },
      staleTime: APP.messagesStaleTimeMs,
      retry: (failureCount, error) =>
        !isUnauthorizedError(error) && failureCount < 2,
      meta: { errorMessageKey: 'chat:errors.messagesFailed' },
    }),
}
