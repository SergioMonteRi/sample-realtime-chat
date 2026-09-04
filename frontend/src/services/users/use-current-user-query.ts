import { useQuery } from '@tanstack/react-query'

import { userQueries } from './user.queries'

export const useCurrentUserQuery = () => useQuery(userQueries.me())
