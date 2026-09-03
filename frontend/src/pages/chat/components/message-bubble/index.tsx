import { useTranslation } from 'react-i18next'

import { BaseIcon } from '@/components/atoms'
import type { ChatMessage } from '@/services/messages'
import { formatTime } from '@/utils'

import { BubbleBody, BubbleContent, BubbleMeta, BubbleRow } from './styles'

type MessageBubbleProps = {
  message: ChatMessage
  isOutgoing: boolean
  /** Primeira mensagem de uma sequencia do mesmo lado — ganha respiro acima. */
  isSequenceStart: boolean
}

export function MessageBubble({
  message,
  isOutgoing,
  isSequenceStart,
}: MessageBubbleProps) {
  const { t, i18n } = useTranslation('chat')

  const isSending = message.deliveryStatus === 'sending'
  const locale = i18n.resolvedLanguage ?? i18n.language

  return (
    <BubbleRow $isOutgoing={isOutgoing} $isSequenceStart={isSequenceStart}>
      <BubbleBody $isOutgoing={isOutgoing}>
        <BubbleContent>{message.content}</BubbleContent>

        <BubbleMeta $isOutgoing={isOutgoing}>
          {isSending ? (
            <>
              <BaseIcon name="clock" size={11} strokeWidth={2} />
              {t('conversation.sending')}
            </>
          ) : (
            formatTime(message.createdAt, locale)
          )}
        </BubbleMeta>
      </BubbleBody>
    </BubbleRow>
  )
}
