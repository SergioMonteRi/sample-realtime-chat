import { useMutation, useQueryClient } from '@tanstack/react-query'

import { authMutations } from './auth.mutations'

export const useLogoutMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(authMutations.logout(queryClient))
}
