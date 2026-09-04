import { queryOptions } from '@tanstack/react-query'

import { isUnauthorizedError } from '@/services/http'

import { userService } from './user.service'

export const userKeys = {
  all: ['users'] as const,
  list: () => [...userKeys.all, 'list'] as const,
  me: () => [...userKeys.all, 'me'] as const,
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

  /**
   * A identidade de quem esta logado.
   *
   * Sem o proprio `id` nao se sabe de que lado da conversa cada mensagem
   * fica, entao esta query e pre-requisito para renderizar o historico — nao
   * um enfeite. Ela nao envelhece: a identidade nao muda enquanto a sessao
   * vive.
   */
  me: () =>
    queryOptions({
      queryKey: userKeys.me(),
      queryFn: userService.getCurrentUser,
      staleTime: Infinity,
      retry: (failureCount, error) =>
        !isUnauthorizedError(error) && failureCount < 2,
      meta: { errorMessageKey: 'chat:errors.identityFailed' },
    }),
}
