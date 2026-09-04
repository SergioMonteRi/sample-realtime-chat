import type { User } from '@/services/users'
import { getDisplayNameFromEmail } from '@/utils'

import { ConversationHeader } from '../conversation-header'
import { MessageComposer } from '../message-composer'
import { MessageList } from '../message-list'
import { PanelWrapper } from './styles'
import { useConversationPanel } from './use-conversation-panel'

type ConversationPanelProps = {
  contact: User
}

export function ConversationPanel({ contact }: ConversationPanelProps) {
  const {
    chatId,
    currentUserId,
    messages,
    isLoading,
    hasError,
    isRefreshing,
    handleRefresh,
  } = useConversationPanel({ contactId: contact.id })

  return (
    <PanelWrapper>
      <ConversationHeader
        contact={contact}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
      />

      <MessageList
        messages={messages}
        chatId={chatId}
        currentUserId={currentUserId}
        peerName={getDisplayNameFromEmail(contact.email)}
        isLoading={isLoading}
        hasError={hasError}
        onRetry={handleRefresh}
      />

      <MessageComposer chatId={chatId} senderId={currentUserId} />
    </PanelWrapper>
  )
}
