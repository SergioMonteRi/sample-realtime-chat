import { useTranslation } from 'react-i18next'

import { BaseButton, BaseSpinner } from '@/components/atoms'
import { EmptyState, SearchField } from '@/components/molecules'
import type { User } from '@/services/users'
import { getDisplayNameFromEmail } from '@/utils'

import { ContactItem } from '../contact-item'
import {
  ContactList,
  SidebarCount,
  SidebarHeader,
  SidebarStatus,
  SidebarTitle,
  SidebarTitleRow,
  SidebarWrapper,
} from './styles'
import { useChatSidebar } from './use-chat-sidebar'

type ChatSidebarProps = {
  contacts: User[]
  selectedContactId: string | undefined
  isLoading: boolean
  hasError: boolean
  onSelectContact: (contactId: string) => void
  onRetry: () => void
}

export function ChatSidebar({
  contacts,
  selectedContactId,
  isLoading,
  hasError,
  onSelectContact,
  onRetry,
}: ChatSidebarProps) {
  const { t } = useTranslation('chat')
  const { t: tCommon } = useTranslation('common')

  const { searchTerm, filteredContacts, hasSearchTerm, handleSearchChange } =
    useChatSidebar({ contacts })

  const hasContacts = filteredContacts.length > 0

  return (
    <SidebarWrapper>
      <SidebarHeader>
        <SidebarTitleRow>
          <SidebarTitle>{t('sidebar.title')}</SidebarTitle>

          {!isLoading && !hasError && (
            <SidebarCount>
              {t('sidebar.count', { count: contacts.length })}
            </SidebarCount>
          )}
        </SidebarTitleRow>

        <SearchField
          value={searchTerm}
          label={t('sidebar.searchLabel')}
          placeholder={t('sidebar.searchPlaceholder')}
          onChange={handleSearchChange}
        />
      </SidebarHeader>

      {isLoading && (
        <SidebarStatus>
          <BaseSpinner size={18} label={t('sidebar.loading')} />
        </SidebarStatus>
      )}

      {!isLoading && hasError && (
        <SidebarStatus>
          <EmptyState
            icon="refresh"
            title={t('sidebar.error.title')}
            description={t('sidebar.error.description')}
            action={
              <BaseButton variant="secondary" size="sm" onClick={onRetry}>
                {tCommon('actions.retry')}
              </BaseButton>
            }
          />
        </SidebarStatus>
      )}

      {!isLoading && !hasError && !hasContacts && (
        <SidebarStatus>
          <EmptyState
            icon={hasSearchTerm ? 'search' : 'userPlus'}
            title={
              hasSearchTerm
                ? t('sidebar.noResults.title')
                : t('sidebar.empty.title')
            }
            description={
              hasSearchTerm
                ? t('sidebar.noResults.description')
                : t('sidebar.empty.description')
            }
          />
        </SidebarStatus>
      )}

      {!isLoading && !hasError && hasContacts && (
        <ContactList>
          {filteredContacts.map((contact) => (
            <li key={contact.id}>
              <ContactItem
                contact={contact}
                isActive={contact.id === selectedContactId}
                label={t('conversation.openLabel', {
                  name: getDisplayNameFromEmail(contact.email),
                })}
                onSelect={onSelectContact}
              />
            </li>
          ))}
        </ContactList>
      )}
    </SidebarWrapper>
  )
}
