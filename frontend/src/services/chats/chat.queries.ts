import { queryOptions } from '@tanstack/react-query'

import { APP } from '@/constants'
import { isUnauthorizedError } from '@/services/http'

import { chatService } from './chat.service'

export const chatKeys = {
  all: ['chats'] as const,
  withUser: (userId: string) => [...chatKeys.all, 'with-user', userId] as const,
}

export const chatQueries = {
  /**
   * Resolve o id da conversa com um contato.
   *
   * O backend nao tem um `GET /chats`: a unica forma de descobrir o chat de
   * um par e o `POST /chat`, que devolve o existente quando ja existe. Por
   * ser idempotente, ele se comporta como leitura e cabe em uma query — o
   * que mantem a resolucao fora de `useEffect` e faz o link
   * `/conversas/:userId` funcionar direto, sem passar pela lista.
   *
   * O par de participantes nunca muda, entao o resultado nao envelhece.
   */
  withUser: (userId: string) =>
    queryOptions({
      queryKey: chatKeys.withUser(userId),
      queryFn: () => chatService.createChat({ receiverId: userId }),
      staleTime: APP.chatResolutionStaleTimeMs,
      retry: (failureCount, error) =>
        !isUnauthorizedError(error) && failureCount < 1,
      meta: { errorMessageKey: 'chat:errors.openConversationFailed' },
    }),
}
