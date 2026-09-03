import { useTranslation } from 'react-i18next'

import { BaseButton, BaseIcon, BaseTextarea } from '@/components/atoms'

import {
  ComposerActions,
  ComposerForm,
  ComposerHint,
  ComposerWrapper,
} from './styles'
import { useMessageComposer } from './use-message-composer'

type MessageComposerProps = {
  chatId: string | undefined
}

export function MessageComposer({ chatId }: MessageComposerProps) {
  const { t } = useTranslation('chat')

  const {
    contentField,
    maxRows,
    errorMessage,
    isDisabled,
    isSending,
    canSend,
    handleSubmitForm,
    handleKeyDown,
  } = useMessageComposer({ chatId })

  return (
    <ComposerWrapper>
      <ComposerForm onSubmit={handleSubmitForm} noValidate>
        <BaseTextarea
          {...contentField}
          label={t('composer.label')}
          placeholder={t('composer.placeholder')}
          errorMessage={errorMessage}
          maxRows={maxRows}
          onKeyDown={handleKeyDown}
          disabled={isDisabled}
        />

        <ComposerActions>
          <BaseButton
            type="submit"
            size="icon"
            disabled={!canSend}
            isLoading={isSending}
            aria-label={t('composer.send')}
            title={t('composer.send')}
          >
            {!isSending && <BaseIcon name="send" size={17} />}
          </BaseButton>
        </ComposerActions>
      </ComposerForm>

      <ComposerHint>{t('composer.hint')}</ComposerHint>
    </ComposerWrapper>
  )
}
