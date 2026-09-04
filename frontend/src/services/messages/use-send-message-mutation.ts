import { useMutation, useQueryClient } from '@tanstack/react-query'

import { messageMutations } from './message.mutations'

interface UseSendMessageMutationParams {
  chatId: string
  /** Quem envia: vai no balao otimista, antes de o servidor confirmar. */
  senderId: string
}

export const useSendMessageMutation = ({
  chatId,
  senderId,
}: UseSendMessageMutationParams) => {
  const queryClient = useQueryClient()

  return useMutation(messageMutations.send(queryClient, chatId, senderId))
}
