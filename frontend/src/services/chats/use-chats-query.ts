import { useQuery } from '@tanstack/react-query'

import { chatQueries } from './chat.queries'

export const useChatsQuery = () => useQuery(chatQueries.list())
