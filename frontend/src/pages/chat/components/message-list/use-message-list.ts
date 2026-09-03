import type { RefObject } from 'react'
import { useEffect, useRef } from 'react'

import type { ChatMessage } from '@/services/messages'

import type { MessageDayGroup } from './message-list.utils'
import { groupMessagesByDay } from './message-list.utils'

interface UseMessageListParams {
  messages: ChatMessage[]
  peerId: string
}

interface UseMessageListReturn {
  groups: MessageDayGroup[]
  bottomRef: RefObject<HTMLDivElement | null>
}

export const useMessageList = ({
  messages,
  peerId,
}: UseMessageListParams): UseMessageListReturn => {
  const bottomRef = useRef<HTMLDivElement>(null)

  const lastMessageId = messages.at(-1)?.id

  /**
   * Toda conversa abre no fim e acompanha a mensagem nova. A dependencia e o
   * id da ultima mensagem: reordenar ou trocar a otimista pela definitiva
   * tambem rola, mas um refetch que devolve a mesma lista nao mexe na tela.
   */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' })
  }, [lastMessageId, peerId])

  return {
    groups: groupMessagesByDay(messages, peerId),
    bottomRef,
  }
}
