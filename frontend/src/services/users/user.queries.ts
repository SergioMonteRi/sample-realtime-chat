import { queryOptions } from '@tanstack/react-query'

import { isUnauthorizedError } from '@/services/http'

import { userService } from './user.service'

export const userKeys = {
  all: ['users'] as const,
  list: () => [...userKeys.all, 'list'] as const,
}

export const userQueries = {
  list: () =>
    queryOptions({
      queryKey: userKeys.list(),
      queryFn: userService.getUsers,
      /* Sessao recusada nao melhora com nova tentativa: quem trata e o AuthProvider. */
      retry: (failureCount, error) =>
        !isUnauthorizedError(error) && failureCount < 2,
      meta: { errorMessageKey: 'chat:errors.contactsFailed' },
    }),
}
