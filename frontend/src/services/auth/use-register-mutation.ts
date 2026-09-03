import { useMutation } from '@tanstack/react-query'

import { authMutations } from './auth.mutations'

export const useRegisterMutation = () => useMutation(authMutations.register())
