import type { QueryClient } from '@tanstack/react-query'
import { mutationOptions } from '@tanstack/react-query'

import { chatKeys } from './chat.queries'
import { chatService } from './chat.service'

export const chatMutations = {
  /**
   * Cria a conversa com um contato — ou devolve a existente, ja que o
   * endpoint e idempotente.
   *
   * Roda uma vez por conversa, no primeiro envio: e o unico momento em que
   * a aplicacao escreve um chat. Invalidar a lista faz a conversa aparecer
   * na barra lateral e entrega o `chatId` a tela que ja esta aberta.
   */
  create: (queryClient: QueryClient) =>
    mutationOptions({
      mutationKey: [...chatKeys.all, 'create'],
      mutationFn: chatService.createChat,
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: chatKeys.list() })
      },
      meta: { errorMessageKey: 'chat:errors.openConversationFailed' },
    }),
}
