import { useTranslation } from 'react-i18next'

import { BaseButton, BaseIcon, BaseSpinner } from '@/components/atoms'
import { EmptyState, SearchField } from '@/components/molecules'
import { getDisplayNameFromEmail } from '@/utils'

import type { SidebarEntry, SidebarMode } from '../../use-chat'
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
  mode: SidebarMode
  entries: SidebarEntry[]
  totalConversations: number
  selectedContactId: string | undefined
  isLoading: boolean
  hasError: boolean
  onSelectContact: (contactId: string) => void
  onStartPicking: () => void
  onStopPicking: () => void
  onRetry: () => void
}

export function ChatSidebar({
  mode,
  entries,
  totalConversations,
  selectedContactId,
  isLoading,
  hasError,
  onSelectContact,
  onStartPicking,
  onStopPicking,
  onRetry,
}: ChatSidebarProps) {
  const { t } = useTranslation('chat')
  const { t: tCommon } = useTranslation('common')

  const { searchTerm, filteredEntries, hasSearchTerm, handleSearchChange } =
    useChatSidebar({ entries })

  const isPicking = mode === 'contacts'

  /**
   * A estrutura da barra e a mesma nos dois modos; o que muda e a copy.
   * Prefixar a chave evita duas arvores de JSX quase identicas.
   */
  const scope = isPicking ? 'sidebar.contacts' : 'sidebar.conversations'

  const hasEntries = filteredEntries.length > 0

  return (
    <SidebarWrapper>
      <SidebarHeader>
        <SidebarTitleRow>
          {isPicking && (
            <BaseButton
              variant="quiet"
              size="icon"
              onClick={onStopPicking}
              aria-label={t('sidebar.backLabel')}
              title={t('sidebar.backLabel')}
            >
              <BaseIcon name="arrowLeft" size={16} />
            </BaseButton>
          )}

          <SidebarTitle>{t(`${scope}.title`)}</SidebarTitle>

          {!isPicking && !isLoading && !hasError && (
            <SidebarCount>
              {t('sidebar.conversations.count', { count: totalConversations })}
            </SidebarCount>
          )}

          {!isPicking && (
            <BaseButton
              variant="secondary"
              size="icon"
              onClick={onStartPicking}
              aria-label={t('sidebar.newChatLabel')}
              title={t('sidebar.newChatLabel')}
            >
              <BaseIcon name="userPlus" size={16} />
            </BaseButton>
          )}
        </SidebarTitleRow>

        <SearchField
          value={searchTerm}
          label={t(`${scope}.searchLabel`)}
          placeholder={t(`${scope}.searchPlaceholder`)}
          onChange={handleSearchChange}
        />
      </SidebarHeader>

      {isLoading && (
        <SidebarStatus>
          <BaseSpinner size={18} label={t(`${scope}.loading`)} />
        </SidebarStatus>
      )}

      {!isLoading && hasError && (
        <SidebarStatus>
          <EmptyState
            icon="refresh"
            title={t(`${scope}.error.title`)}
            description={t(`${scope}.error.description`)}
            action={
              <BaseButton variant="secondary" size="sm" onClick={onRetry}>
                {tCommon('actions.retry')}
              </BaseButton>
            }
          />
        </SidebarStatus>
      )}

      {!isLoading && !hasError && !hasEntries && (
        <SidebarStatus>
          <EmptyState
            icon={hasSearchTerm ? 'search' : 'userPlus'}
            title={
              hasSearchTerm
                ? t('sidebar.noResults.title')
                : t(`${scope}.empty.title`)
            }
            description={
              hasSearchTerm
                ? t('sidebar.noResults.description')
                : t(`${scope}.empty.description`)
            }
            action={
              !hasSearchTerm && !isPicking ? (
                <BaseButton
                  variant="secondary"
                  size="sm"
                  onClick={onStartPicking}
                >
                  {t('sidebar.contacts.title')}
                </BaseButton>
              ) : undefined
            }
          />
        </SidebarStatus>
      )}

      {!isLoading && !hasError && hasEntries && (
        <ContactList>
          {filteredEntries.map(({ contact, lastMessageAt, preview }) => (
            <li key={contact.id}>
              <ContactItem
                contact={contact}
                lastMessageAt={lastMessageAt}
                preview={preview}
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
