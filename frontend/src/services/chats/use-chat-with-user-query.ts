import { useQuery } from '@tanstack/react-query'

import { chatQueries } from './chat.queries'

interface UseChatWithUserQueryParams {
  userId: string | undefined
}

export const useChatWithUserQuery = ({ userId }: UseChatWithUserQueryParams) =>
  useQuery({
    ...chatQueries.withUser(userId ?? ''),
    enabled: Boolean(userId),
  })
