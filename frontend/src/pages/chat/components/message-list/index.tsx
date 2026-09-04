import { useTranslation } from 'react-i18next'

import { BaseButton, BaseSpinner } from '@/components/atoms'
import { EmptyState } from '@/components/molecules'
import type { ChatMessage } from '@/services/messages'
import { formatDayDate } from '@/utils'

import { MessageBubble } from '../message-bubble'
import type { MessageDayGroup } from './message-list.utils'
import {
  DayGroup,
  DayLabel,
  DaySeparator,
  ListStatus,
  ListWrapper,
  ScrollAnchor,
} from './styles'
import { useMessageList } from './use-message-list'

type MessageListProps = {
  messages: ChatMessage[]
  chatId: string | undefined
  currentUserId: string | undefined
  peerName: string
  isLoading: boolean
  hasError: boolean
  onRetry: () => void
}

export function MessageList({
  messages,
  chatId,
  currentUserId,
  peerName,
  isLoading,
  hasError,
  onRetry,
}: MessageListProps) {
  const { t, i18n } = useTranslation('chat')
  const { t: tCommon } = useTranslation('common')

  const { groups, bottomRef } = useMessageList({
    messages,
    chatId,
    currentUserId,
  })

  const locale = i18n.resolvedLanguage ?? i18n.language

  const getDayLabel = (group: MessageDayGroup) => {
    if (group.bucket === 'today') return t('conversation.day.today')
    if (group.bucket === 'yesterday') return t('conversation.day.yesterday')

    return formatDayDate(group.isoDate, locale)
  }

  if (isLoading || !currentUserId) {
    return (
      <ListStatus>
        <BaseSpinner size={18} label={t('conversation.loading')} />
      </ListStatus>
    )
  }

  if (hasError) {
    return (
      <ListStatus>
        <EmptyState
          icon="refresh"
          title={t('conversation.error.title')}
          description={t('conversation.error.description')}
          action={
            <BaseButton variant="secondary" size="sm" onClick={onRetry}>
              {tCommon('actions.retry')}
            </BaseButton>
          }
        />
      </ListStatus>
    )
  }

  if (messages.length === 0) {
    return (
      <ListStatus>
        <EmptyState
          icon="message"
          title={t('conversation.start.title')}
          description={t('conversation.start.description', { name: peerName })}
        />
      </ListStatus>
    )
  }

  return (
    <ListWrapper>
      {groups.map((group) => (
        <DayGroup key={group.dayKey}>
          <DaySeparator>
            <DayLabel>{getDayLabel(group)}</DayLabel>
          </DaySeparator>

          {group.items.map(({ message, isOutgoing, isSequenceStart }) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOutgoing={isOutgoing}
              isSequenceStart={isSequenceStart}
            />
          ))}
        </DayGroup>
      ))}

      <ScrollAnchor ref={bottomRef} />
    </ListWrapper>
  )
}
