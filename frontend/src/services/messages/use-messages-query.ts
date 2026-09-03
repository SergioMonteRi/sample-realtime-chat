import { useQuery } from '@tanstack/react-query'

import { messageQueries } from './message.queries'

interface UseMessagesQueryParams {
  chatId: string | undefined
}

export const useMessagesQuery = ({ chatId }: UseMessagesQueryParams) =>
  useQuery({
    ...messageQueries.byChat(chatId ?? ''),
    enabled: Boolean(chatId),
  })
