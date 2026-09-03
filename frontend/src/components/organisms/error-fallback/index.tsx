import { useTranslation } from 'react-i18next'

import { BaseBadge, BaseButton, BaseText } from '@/components/atoms'

import { Card } from '../card'
import { FallbackWrapper } from './styles'

type ErrorFallbackProps = {
  resetErrorBoundary: () => void
}

export function ErrorFallback({ resetErrorBoundary }: ErrorFallbackProps) {
  const { t } = useTranslation('errors')
  const { t: tCommon } = useTranslation('common')

  return (
    <FallbackWrapper role="alert">
      <Card.Root>
        <Card.Header>
          <BaseBadge label={t('boundary.badge')} tone="danger" />

          <BaseText as="h1" variant="title">
            {t('boundary.title')}
          </BaseText>
        </Card.Header>

        <Card.Section>
          <BaseText tone="muted">{t('boundary.description')}</BaseText>
        </Card.Section>

        <Card.Footer>
          <BaseButton onClick={resetErrorBoundary} isFullWidth>
            {tCommon('actions.retry')}
          </BaseButton>
        </Card.Footer>
      </Card.Root>
    </FallbackWrapper>
  )
}
