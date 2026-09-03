import { useChatWithUserQuery } from '@/services/chats'
import type { ChatMessage } from '@/services/messages'
import { useMessagesQuery } from '@/services/messages'

interface UseConversationPanelParams {
  contactId: string
}

interface UseConversationPanelReturn {
  chatId: string | undefined
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
 */
export const useConversationPanel = ({
  contactId,
}: UseConversationPanelParams): UseConversationPanelReturn => {
  const chatQuery = useChatWithUserQuery({ userId: contactId })
  const chatId = chatQuery.data?.chatId

  const messagesQuery = useMessagesQuery({ chatId })

  const handleRefresh = () => {
    void (chatQuery.isError ? chatQuery.refetch() : messagesQuery.refetch())
  }

  return {
    chatId,
    messages: messagesQuery.data ?? [],
    isLoading: chatQuery.isLoading || messagesQuery.isLoading,
    hasError: chatQuery.isError || messagesQuery.isError,
    /* Refetch em cima de dados que ja estao na tela: o botao gira, a lista fica. */
    isRefreshing: messagesQuery.isFetching && !messagesQuery.isLoading,
    handleRefresh,
  }
}
