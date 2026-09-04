import { useTranslation } from 'react-i18next'

import { BaseSpinner } from '@/components/atoms'
import { EmptyState } from '@/components/molecules'

import { ChatSidebar, ConversationPanel } from './components'
import {
  ChatLayout,
  ConversationPlaceholder,
  ConversationSlot,
  SidebarSlot,
} from './styles'
import { useChat } from './use-chat'

export function ChatPage() {
  const { t } = useTranslation('chat')

  const {
    mode,
    entries,
    totalConversations,
    selectedContactId,
    selectedPeer,
    isResolvingPeer,
    isLoading,
    hasError,
    handleSelectContact,
    handleStartPicking,
    handleStopPicking,
    handleRetry,
  } = useChat()

  const hasOpenConversation = Boolean(selectedContactId)

  return (
    <ChatLayout>
      <SidebarSlot $isHiddenOnNarrow={hasOpenConversation}>
        <ChatSidebar
          mode={mode}
          entries={entries}
          totalConversations={totalConversations}
          selectedContactId={selectedContactId}
          isLoading={isLoading}
          hasError={hasError}
          onSelectContact={handleSelectContact}
          onStartPicking={handleStartPicking}
          onStopPicking={handleStopPicking}
          onRetry={handleRetry}
        />
      </SidebarSlot>

      <ConversationSlot $isHiddenOnNarrow={!hasOpenConversation}>
        {selectedPeer ? (
          <ConversationPanel contact={selectedPeer} />
        ) : (
          <ConversationPlaceholder>
            {isResolvingPeer ? (
              <BaseSpinner size={18} label={t('conversation.loading')} />
            ) : (
              <EmptyState
                icon="message"
                title={t('conversation.empty.title')}
                description={t('conversation.empty.description')}
              />
            )}
          </ConversationPlaceholder>
        )}
      </ConversationSlot>
    </ChatLayout>
  )
}
