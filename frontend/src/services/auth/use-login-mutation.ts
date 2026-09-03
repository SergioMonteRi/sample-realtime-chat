import { useMutation } from '@tanstack/react-query'

import { authMutations } from './auth.mutations'

export const useLoginMutation = () => useMutation(authMutations.login())
