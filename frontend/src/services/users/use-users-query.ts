import { useQuery } from '@tanstack/react-query'

import { userQueries } from './user.queries'

export const useUsersQuery = () => useQuery(userQueries.list())
