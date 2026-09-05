import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { buildConversationRoute } from '@/constants'
import type { ChatParticipant } from '@/services/chats'
import { useChatsQuery } from '@/services/chats'
import { isOutgoingMessage } from '@/services/messages'
import { useCurrentUserQuery, useUsersQuery } from '@/services/users'

/**
 * A barra lateral tem dois modos sobre a mesma linha visual: as conversas
 * que existem e, quando se quer comecar uma, os contatos que ainda nao tem
 * conversa.
 */
export type SidebarMode = 'conversations' | 'contacts'

export interface SidebarEntry {
  contact: ChatParticipant
  /** Quando a conversa se moveu por ultimo; nulo num contato sem conversa. */
  lastMessageAt: string | null
  /** Previa da ultima mensagem; nula num contato sem conversa. */
  preview: { content: string; isOutgoing: boolean } | null
}

interface UseChatReturn {
  mode: SidebarMode
  entries: SidebarEntry[]
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

  /**
   * Identidade so para decidir o "Voce:" da previa. Ja esta em cache (o
   * painel da conversa a pede tambem), entao nao custa requisicao.
   */
  const currentUserId = useCurrentUserQuery().data?.id

  const conversationPeer = chats.find(
    (chat) => chat.participant.id === userId,
  )?.participant

  /**
   * A agenda inteira (`GET /users`) so e buscada quando faz falta: para
   * escolher com quem comecar, ou para dar nome a um contato que ainda nao
   * tem conversa — o caso de abrir `/conversations/:userId` direto pela URL.
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
      ? contacts
          .filter((contact) => !conversationPeerIds.has(contact.id))
          .map((contact) => ({
            contact,
            lastMessageAt: null,
            preview: null,
          }))
      : chats.map((chat) => ({
          contact: chat.participant,
          lastMessageAt: chat.lastMessageAt,
          preview: chat.lastMessage
            ? {
                content: chat.lastMessage.content,
                /* Mesma regra do balao: compara o remetente com o `/me`. */
                isOutgoing:
                  currentUserId !== undefined &&
                  isOutgoingMessage(chat.lastMessage, currentUserId),
              }
            : null,
        })),
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
