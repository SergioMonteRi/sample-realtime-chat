import type { QueryClient } from '@tanstack/react-query'
import { mutationOptions } from '@tanstack/react-query'

import { insertMessage, settleMessage } from './message.cache'
import { messageKeys, messageQueries } from './message.queries'
import { messageService } from './message.service'
import type { SendMessageVariables } from './message.types'
import { createOptimisticMessage, toSentMessage } from './message.utils'

export const messageMutations = {
  /**
   * Envio com optimistic update: o balao aparece marcado como "enviando" no
   * mesmo frame do clique e e trocado pela mensagem do servidor quando ela
   * volta — o id definitivo vem de la. Se falhar, a lista retorna ao estado
   * anterior e o texto e devolvido ao campo (ver `use-message-composer`).
   */
  send: (queryClient: QueryClient, senderId: string) =>
    mutationOptions({
      mutationKey: [...messageKeys.all, 'send'],
      mutationFn: ({ chatId, content }: SendMessageVariables) =>
        messageService.createMessage(chatId, { content }),

      onMutate: async ({ chatId, content }) => {
        const { queryKey } = messageQueries.byChat(chatId)

        await queryClient.cancelQueries({ queryKey })

        const previousMessages = queryClient.getQueryData(queryKey)
        const optimisticMessage = createOptimisticMessage({
          chatId,
          senderId,
          content,
        })

        queryClient.setQueryData(queryKey, (current) =>
          insertMessage(current ?? [], optimisticMessage),
        )

        return { optimisticId: optimisticMessage.id, previousMessages }
      },

      onSuccess: (message, variables, context) => {
        const { queryKey } = messageQueries.byChat(variables.chatId)

        queryClient.setQueryData(queryKey, (current) =>
          settleMessage(
            current ?? [],
            context.optimisticId,
            toSentMessage(message),
          ),
        )
      },

      onError: (_error, variables, context) => {
        const { queryKey } = messageQueries.byChat(variables.chatId)

        queryClient.setQueryData(queryKey, context?.previousMessages)
      },

      meta: { errorMessageKey: 'chat:errors.sendMessageFailed' },
    }),
}
