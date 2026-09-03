import type { QueryClient } from '@tanstack/react-query'
import { mutationOptions } from '@tanstack/react-query'

import { authService } from './auth.service'

const authKeys = {
  all: ['auth'] as const,
}

export const authMutations = {
  login: () =>
    mutationOptions({
      mutationKey: [...authKeys.all, 'login'],
      mutationFn: authService.login,
      /* A tela de login mostra o erro inline; sem `meta` nao ha toast duplicado. */
    }),

  register: () =>
    mutationOptions({
      mutationKey: [...authKeys.all, 'register'],
      mutationFn: authService.register,
      /* O erro aparece inline no formulario; so o sucesso vira toast. */
      meta: { successMessageKey: 'auth:register.success' },
    }),

  /**
   * O cache guarda contatos e historico da pessoa que esta saindo. Limpar
   * no `onSettled` — e nao so no sucesso — evita que a proxima sessao
   * comece enxergando dados da anterior mesmo se a chamada falhar.
   */
  logout: (queryClient: QueryClient) =>
    mutationOptions({
      mutationKey: [...authKeys.all, 'logout'],
      mutationFn: authService.logout,
      onSettled: () => {
        queryClient.clear()
      },
      meta: { errorMessageKey: 'auth:errors.logoutFailed' },
    }),
}
