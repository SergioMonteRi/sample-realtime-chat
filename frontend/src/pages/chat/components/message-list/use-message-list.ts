import type { RefObject } from 'react'
import { useEffect, useRef } from 'react'

import type { ChatMessage } from '@/services/messages'

import type { MessageDayGroup } from './message-list.utils'
import { groupMessagesByDay } from './message-list.utils'

interface UseMessageListParams {
  messages: ChatMessage[]
  /** Ausente enquanto o `POST /chat` resolve a conversa. */
  chatId: string | undefined
  /** Ausente enquanto `GET /me` nao respondeu. */
  currentUserId: string | undefined
}

interface UseMessageListReturn {
  groups: MessageDayGroup[]
  bottomRef: RefObject<HTMLDivElement | null>
}

export const useMessageList = ({
  messages,
  chatId,
  currentUserId,
}: UseMessageListParams): UseMessageListReturn => {
  const bottomRef = useRef<HTMLDivElement>(null)

  const lastMessageId = messages.at(-1)?.id

  /**
   * Toda conversa abre no fim e acompanha a mensagem nova. As dependencias
   * sao a ultima mensagem e a conversa aberta: reordenar ou trocar a
   * otimista pela definitiva tambem rola, mas um refetch que devolve a mesma
   * lista nao mexe na tela.
   */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' })
  }, [lastMessageId, chatId])

  return {
    /* Sem identidade nao ha lado; a lista nem chega a ser renderizada. */
    groups: currentUserId ? groupMessagesByDay(messages, currentUserId) : [],
    bottomRef,
  }
}
