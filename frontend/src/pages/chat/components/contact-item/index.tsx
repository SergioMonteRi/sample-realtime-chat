import { useTranslation } from 'react-i18next'

import { BaseAvatar } from '@/components/atoms'
import type { ChatParticipant } from '@/services/chats'
import {
  formatShortDate,
  formatTime,
  getDayBucket,
  getDisplayNameFromEmail,
} from '@/utils'

import {
  ContactButton,
  ContactCopy,
  ContactEmail,
  ContactMeta,
  ContactName,
  ContactPreview,
} from './styles'

type ContactItemProps = {
  /** Serve tanto ao participante de uma conversa quanto a um contato novo. */
  contact: ChatParticipant
  /** Ausente num contato que ainda nao tem conversa. */
  lastMessageAt: string | null
  /** Ausente num contato que ainda nao tem conversa. */
  preview: { content: string; isOutgoing: boolean } | null
  isActive: boolean
  label: string
  onSelect: (contactId: string) => void
}

export function ContactItem({
  contact,
  lastMessageAt,
  preview,
  isActive,
  label,
  onSelect,
}: ContactItemProps) {
  const { t, i18n } = useTranslation('chat')

  const displayName = getDisplayNameFromEmail(contact.email)
  const locale = i18n.resolvedLanguage ?? i18n.language

  /**
   * Quanto mais recente, mais preciso: hoje mostra a hora, ontem diz
   * "ontem", e o resto vira data curta — a linha e estreita, e a precisao
   * de uma conversa de semanas atras nao interessa.
   */
  const getActivityLabel = () => {
    if (!lastMessageAt) return null

    const bucket = getDayBucket(lastMessageAt)

    if (bucket === 'today') return formatTime(lastMessageAt, locale)
    if (bucket === 'yesterday') return t('conversation.day.yesterday')

    return formatShortDate(lastMessageAt, locale)
  }

  const activityLabel = getActivityLabel()

  const handleSelect = () => {
    onSelect(contact.id)
  }

  return (
    <ContactButton
      type="button"
      onClick={handleSelect}
      aria-current={isActive ? 'true' : undefined}
      aria-label={label}
      $isActive={isActive}
    >
      <BaseAvatar name={displayName} seed={contact.id} size="md" />

      <ContactCopy>
        <ContactName>{displayName}</ContactName>

        {/* Com previa o e-mail sai de cena: o nome ja vem dele, e a busca
            continua cobrindo os dois. */}
        {preview ? (
          <ContactPreview>
            {preview.isOutgoing
              ? t('sidebar.preview.outgoing', { content: preview.content })
              : preview.content}
          </ContactPreview>
        ) : (
          <ContactEmail>{contact.email}</ContactEmail>
        )}
      </ContactCopy>

      {activityLabel && (
        <ContactMeta>
          <time dateTime={lastMessageAt ?? undefined}>{activityLabel}</time>
        </ContactMeta>
      )}
    </ContactButton>
  )
}
