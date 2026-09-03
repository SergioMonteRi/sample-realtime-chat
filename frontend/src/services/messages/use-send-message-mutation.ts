import { useMutation, useQueryClient } from '@tanstack/react-query'

import { messageMutations } from './message.mutations'

interface UseSendMessageMutationParams {
  chatId: string
}

export const useSendMessageMutation = ({
  chatId,
}: UseSendMessageMutationParams) => {
  const queryClient = useQueryClient()

  return useMutation(messageMutations.send(queryClient, chatId))
}
