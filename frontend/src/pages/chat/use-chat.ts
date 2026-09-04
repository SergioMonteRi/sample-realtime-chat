import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { buildConversationRoute } from '@/constants'
import type { ChatParticipant } from '@/services/chats'
import { useChatsQuery } from '@/services/chats'
import { useUsersQuery } from '@/services/users'

/**
 * A barra lateral tem dois modos sobre a mesma linha visual: as conversas
 * que existem e, quando se quer comecar uma, os contatos que ainda nao tem
 * conversa.
 */
export type SidebarMode = 'conversations' | 'contacts'

interface UseChatReturn {
  mode: SidebarMode
  entries: ChatParticipant[]
  totalConversations: number
  selectedContactId: string | undefined
  selectedPeer: ChatParticipant | undefined
  isResolvingPeer: boolean
  isLoading: boolean
  hasError: boolean
  handleSelectContact: (contactId: string) => void
  handleStartPicking: () => void
  handleStopPicking: () => void
  handleRetry: () => void
}

export const useChat = (): UseChatReturn => {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()

  /* Modo da barra lateral: interface, e nao servidor. */
  const [isPicking, setIsPicking] = useState(false)

  const chatsQuery = useChatsQuery()
  const chats = chatsQuery.data ?? []

  const conversationPeer = chats.find(
    (chat) => chat.participant.id === userId,
  )?.participant

  /**
   * A agenda inteira (`GET /users`) so e buscada quando faz falta: para
   * escolher com quem comecar, ou para dar nome a um contato que ainda nao
   * tem conversa — o caso de abrir `/conversas/:userId` direto pela URL.
   */
  const needsContacts =
    isPicking || (Boolean(userId) && chatsQuery.isSuccess && !conversationPeer)

  const usersQuery = useUsersQuery({ enabled: needsContacts })
  const contacts = usersQuery.data ?? []

  const conversationPeerIds = new Set(chats.map((chat) => chat.participant.id))

  const handleSelectContact = (contactId: string) => {
    setIsPicking(false)
    void navigate(buildConversationRoute(contactId))
  }

  const activeQuery = isPicking ? usersQuery : chatsQuery

  return {
    mode: isPicking ? 'contacts' : 'conversations',
    entries: isPicking
      ? contacts.filter((contact) => !conversationPeerIds.has(contact.id))
      : chats.map((chat) => chat.participant),
    totalConversations: chats.length,
    selectedContactId: userId,
    /**
     * O contato aberto vem da lista de conversas quando ela existe; se nao,
     * da agenda — e o caso de uma conversa que ainda nao foi criada.
     */
    selectedPeer:
      conversationPeer ?? contacts.find((contact) => contact.id === userId),
    isResolvingPeer: needsContacts && usersQuery.isLoading,
    isLoading: activeQuery.isLoading,
    hasError: activeQuery.isError,
    handleSelectContact,
    handleStartPicking: () => setIsPicking(true),
    handleStopPicking: () => setIsPicking(false),
    handleRetry: () => void activeQuery.refetch(),
  }
}
