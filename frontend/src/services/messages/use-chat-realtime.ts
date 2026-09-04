import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { applyChatActivity } from '../chats/chat.cache'
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

      /* A barra lateral ordena por atividade: a conversa sobe agora. */
      applyChatActivity(queryClient, message)
    })

    realtime.joinChat(chatId)

    return unsubscribe
  }, [chatId, queryClient])
}
