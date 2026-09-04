import { useMutation, useQueryClient } from '@tanstack/react-query'

import { messageMutations } from './message.mutations'

interface UseSendMessageMutationParams {
  /** Quem envia: vai no balao otimista, antes de o servidor confirmar. */
  senderId: string
}

export const useSendMessageMutation = ({
  senderId,
}: UseSendMessageMutationParams) => {
  const queryClient = useQueryClient()

  return useMutation(messageMutations.send(queryClient, senderId))
}
