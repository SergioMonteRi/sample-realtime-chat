import { useMutation, useQueryClient } from '@tanstack/react-query'

import { chatMutations } from './chat.mutations'

export const useCreateChatMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(chatMutations.create(queryClient))
}
