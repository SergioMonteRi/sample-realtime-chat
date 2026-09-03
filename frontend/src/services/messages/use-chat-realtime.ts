import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { getRealtimeGateway } from '../realtime'
import { applyIncomingMessage } from './message.cache'

interface UseChatRealtimeParams {
  chatId: string | undefined
}

export const useChatRealtime = ({ chatId }: UseChatRealtimeParams) => {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!chatId) return

    const realtime = getRealtimeGateway()

    const unsubscribe = realtime.onNewMessage((message) => {
      applyIncomingMessage(queryClient, message)
    })

    realtime.joinChat(chatId)

    return unsubscribe
  }, [chatId, queryClient])
}
