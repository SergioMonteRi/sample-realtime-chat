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
   * Nada aqui revalida por conta propria: nem polling, nem foco da janela,
   * nem reconexao de rede. Quem traz mensagem nova e o canal, que escreve
   * nesta mesma queryKey (`applyIncomingMessage`) — um refetch periodico
   * repetiria o trabalho do socket e, pior, disfarcaria uma queda dele.
   * Sobram a carga inicial e o botao de atualizar do cabecalho, que e a rede
   * de seguranca para quando o canal cai.
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
