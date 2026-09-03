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
   * Historico da conversa.
   *
   * Sem canal em tempo real, nada revalida sozinho: nem polling, nem foco da
   * janela, nem reconexao de rede. A mensagem nova so aparece quando a pessoa
   * pede, pelo botao de atualizar do cabecalho, ou ao abrir a conversa. Com
   * duas abas lado a lado, o refetch no foco dava a ilusao de tempo real e
   * escondia justamente o buraco que o Socket.IO vem preencher.
   */
  byChat: (chatId: string) =>
    queryOptions({
      queryKey: messageKeys.byChat(chatId),
      queryFn: async () => {
        const messages = await messageService.getMessages(chatId)

        return messages.map(toSentMessage)
      },
      staleTime: APP.messagesStaleTimeMs,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: (failureCount, error) =>
        !isUnauthorizedError(error) && failureCount < 2,
      meta: { errorMessageKey: 'chat:errors.messagesFailed' },
    }),
}
