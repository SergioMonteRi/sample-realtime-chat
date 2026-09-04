import { apiClient } from '@/services/http'

import {
  currentUserResponseSchema,
  getUsersResponseSchema,
} from './user.schemas'
import type { User } from './user.types'

const USERS_ENDPOINT = '/users'
const CURRENT_USER_ENDPOINT = '/me'

export const userService = {
  /**
   * O backend ja exclui o usuario autenticado da lista (`UserService.get_users`),
   * entao o que volta daqui e exatamente a agenda de contatos.
   */
  getUsers: async (): Promise<User[]> => {
    const { data } = await apiClient.get(USERS_ENDPOINT)

    return getUsersResponseSchema.parse(data).users
  },

  /**
   * Quem esta logado, resolvido pelo cookie de sessao. E a unica forma de a
   * aplicacao saber o proprio `id`: o login devolve so uma mensagem, e o
   * cookie e httpOnly.
   */
  getCurrentUser: async (): Promise<User> => {
    const { data } = await apiClient.get(CURRENT_USER_ENDPOINT)

    return currentUserResponseSchema.parse(data)
  },
}
