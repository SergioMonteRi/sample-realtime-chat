import { useTranslation } from 'react-i18next'

import { BaseAvatar, BaseButton, BaseIcon } from '@/components/atoms'
import { ROUTES } from '@/constants'
import type { User } from '@/services/users'
import { getDisplayNameFromEmail } from '@/utils'

import {
  BackLink,
  HeaderActions,
  HeaderCopy,
  HeaderEmail,
  HeaderName,
  HeaderWrapper,
  RealtimeNotice,
} from './styles'

type ConversationHeaderProps = {
  contact: User
  isRefreshing: boolean
  onRefresh: () => void
}

export function ConversationHeader({
  contact,
  isRefreshing,
  onRefresh,
}: ConversationHeaderProps) {
  const { t } = useTranslation('chat')
  const { t: tCommon } = useTranslation('common')

  const displayName = getDisplayNameFromEmail(contact.email)

  return (
    <HeaderWrapper>
      <BackLink to={ROUTES.conversations} aria-label={tCommon('actions.back')}>
        <BaseIcon name="arrowLeft" size={18} />
      </BackLink>

      <BaseAvatar name={displayName} seed={contact.id} size="md" />

      <HeaderCopy>
        <HeaderName>{displayName}</HeaderName>
        <HeaderEmail>{contact.email}</HeaderEmail>
      </HeaderCopy>

      <HeaderActions>
        <RealtimeNotice>{t('conversation.realtimeNotice')}</RealtimeNotice>

        <BaseButton
          variant="secondary"
          size="icon"
          onClick={onRefresh}
          isLoading={isRefreshing}
          aria-label={t('conversation.refreshLabel')}
          title={t('conversation.refreshLabel')}
        >
          {!isRefreshing && <BaseIcon name="refresh" size={16} />}
        </BaseButton>
      </HeaderActions>
    </HeaderWrapper>
  )
}
