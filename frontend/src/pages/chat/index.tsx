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
    contacts,
    selectedContact,
    selectedContactId,
    isLoadingContacts,
    hasContactsError,
    handleSelectContact,
    handleRetryContacts,
  } = useChat()

  const hasOpenConversation = Boolean(selectedContactId)

  return (
    <ChatLayout>
      <SidebarSlot $isHiddenOnNarrow={hasOpenConversation}>
        <ChatSidebar
          contacts={contacts}
          selectedContactId={selectedContactId}
          isLoading={isLoadingContacts}
          hasError={hasContactsError}
          onSelectContact={handleSelectContact}
          onRetry={handleRetryContacts}
        />
      </SidebarSlot>

      <ConversationSlot $isHiddenOnNarrow={!hasOpenConversation}>
        {selectedContact ? (
          <ConversationPanel contact={selectedContact} />
        ) : (
          <ConversationPlaceholder>
            {isLoadingContacts && hasOpenConversation ? (
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
