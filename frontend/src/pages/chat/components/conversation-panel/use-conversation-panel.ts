import { useChatsQuery } from '@/services/chats'
import type { ChatMessage } from '@/services/messages'
import { useChatRealtime, useMessagesQuery } from '@/services/messages'
import { useCurrentUserQuery } from '@/services/users'

interface UseConversationPanelParams {
  contactId: string
}

interface UseConversationPanelReturn {
  chatId: string | undefined
  currentUserId: string | undefined
  messages: ChatMessage[]
  isLoading: boolean
  hasError: boolean
  isRefreshing: boolean
  handleRefresh: () => void
}

/**
 * Tres leituras, nenhuma escrita: a identidade (`GET /me`), a lista de
 * conversas — que e onde o `chatId` mora — e o historico.
 *
 * O `chatId` sai de uma lista que a barra lateral tambem consome, entao o
 * React Query serve as duas com uma requisicao. Ele e `undefined` quando a
 * conversa ainda nao existe: nesse caso o historico nem liga, e a conversa
 * passa a existir no primeiro envio (ver `use-message-composer`).
 */
export const useConversationPanel = ({
  contactId,
}: UseConversationPanelParams): UseConversationPanelReturn => {
  const currentUserQuery = useCurrentUserQuery()
  const chatsQuery = useChatsQuery()

  const chatId = chatsQuery.data?.find(
    (chat) => chat.participant.id === contactId,
  )?.id

  const messagesQuery = useMessagesQuery({ chatId })

  useChatRealtime({ chatId })

  /* Tenta de novo a etapa que falhou; sem falha, atualiza o historico. */
  const handleRefresh = () => {
    if (currentUserQuery.isError) {
      void currentUserQuery.refetch()
      return
    }

    if (chatsQuery.isError) {
      void chatsQuery.refetch()
      return
    }

    void messagesQuery.refetch()
  }

  return {
    chatId,
    currentUserId: currentUserQuery.data?.id,
    messages: messagesQuery.data ?? [],
    isLoading:
      currentUserQuery.isLoading ||
      chatsQuery.isLoading ||
      messagesQuery.isLoading,
    hasError:
      currentUserQuery.isError || chatsQuery.isError || messagesQuery.isError,
    /* Refetch em cima de dados que ja estao na tela: o botao gira, a lista fica. */
    isRefreshing: messagesQuery.isFetching && !messagesQuery.isLoading,
    handleRefresh,
  }
}
