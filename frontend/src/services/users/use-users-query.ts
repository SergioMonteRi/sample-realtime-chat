import { useQuery } from '@tanstack/react-query'

import { userQueries } from './user.queries'

interface UseUsersQueryParams {
  /**
   * A agenda deixou de ser a lista de conversas: ela agora serve para
   * comecar uma, entao so vale buscar quando alguem pede.
   */
  enabled?: boolean
}

export const useUsersQuery = ({ enabled = true }: UseUsersQueryParams = {}) =>
  useQuery({ ...userQueries.list(), enabled })
