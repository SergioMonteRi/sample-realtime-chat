import type { QueryClient } from '@tanstack/react-query'
import { mutationOptions } from '@tanstack/react-query'

import { insertMessage, replaceMessage } from './message.cache'
import { messageKeys, messageQueries } from './message.queries'
import { messageService } from './message.service'
import type { SendMessageRequest } from './message.types'
import { createOptimisticMessage, toSentMessage } from './message.utils'

export const messageMutations = {
  /**
   * Envio com optimistic update: o balao aparece marcado como "enviando" no
   * mesmo frame do clique e e trocado pela mensagem do servidor quando ela
   * volta — o id definitivo vem de la. Se falhar, a lista retorna ao estado
   * anterior e o texto e devolvido ao campo (ver `use-message-composer`).
   */
  send: (queryClient: QueryClient, chatId: string, senderId: string) => {
    const { queryKey } = messageQueries.byChat(chatId)

    return mutationOptions({
      mutationKey: [...messageKeys.byChat(chatId), 'send'],
      mutationFn: (payload: SendMessageRequest) =>
        messageService.createMessage(chatId, payload),

      onMutate: async (payload) => {
        await queryClient.cancelQueries({ queryKey })

        const previousMessages = queryClient.getQueryData(queryKey)
        const optimisticMessage = createOptimisticMessage({
          chatId,
          senderId,
          content: payload.content,
        })

        queryClient.setQueryData(queryKey, (current) =>
          insertMessage(current ?? [], optimisticMessage),
        )

        return { optimisticId: optimisticMessage.id, previousMessages }
      },

      onSuccess: (message, _payload, context) => {
        queryClient.setQueryData(queryKey, (current) =>
          replaceMessage(
            current ?? [],
            context.optimisticId,
            toSentMessage(message),
          ),
        )
      },

      onError: (_error, _payload, context) => {
        queryClient.setQueryData(queryKey, context?.previousMessages)
      },

      meta: { errorMessageKey: 'chat:errors.sendMessageFailed' },
    })
  },
}
