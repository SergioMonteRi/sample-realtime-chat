import { apiClient } from '@/services/http'

import { getUsersResponseSchema } from './user.schemas'
import type { User } from './user.types'

const USERS_ENDPOINT = '/users'

export const userService = {
  /**
   * O backend ja exclui o usuario autenticado da lista (`UserService.get_users`),
   * entao o que volta daqui e exatamente a agenda de contatos.
   */
  getUsers: async (): Promise<User[]> => {
    const { data } = await apiClient.get(USERS_ENDPOINT)

    return getUsersResponseSchema.parse(data).users
  },
}
