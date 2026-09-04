import { useChatWithUserQuery } from '@/services/chats'
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
 * Duas etapas encadeadas: primeiro o id da conversa com aquele contato,
 * depois o historico. A segunda query so liga quando a primeira responde —
 * `enabled` no lugar de um `useEffect` de orquestracao.
 *
 * Em paralelo corre a identidade (`GET /me`), que nao depende das outras
 * duas mas tambem nao e dispensavel: sem o proprio id nao se sabe de que
 * lado fica cada mensagem, entao ela entra no `isLoading`.
 */
export const useConversationPanel = ({
  contactId,
}: UseConversationPanelParams): UseConversationPanelReturn => {
  const currentUserQuery = useCurrentUserQuery()

  const chatQuery = useChatWithUserQuery({ userId: contactId })
  const chatId = chatQuery.data?.chatId

  const messagesQuery = useMessagesQuery({ chatId })

  useChatRealtime({ chatId })

  /* Tenta de novo a etapa que falhou; sem falha, atualiza o historico. */
  const handleRefresh = () => {
    if (currentUserQuery.isError) {
      void currentUserQuery.refetch()
      return
    }

    if (chatQuery.isError) {
      void chatQuery.refetch()
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
      chatQuery.isLoading ||
      messagesQuery.isLoading,
    hasError:
      currentUserQuery.isError || chatQuery.isError || messagesQuery.isError,
    /* Refetch em cima de dados que ja estao na tela: o botao gira, a lista fica. */
    isRefreshing: messagesQuery.isFetching && !messagesQuery.isLoading,
    handleRefresh,
  }
}
