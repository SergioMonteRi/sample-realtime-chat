import { useTranslation } from 'react-i18next'

import { BaseBadge, BaseText } from '@/components/atoms'
import { ROUTES } from '@/constants'

import {
  NotFoundContent,
  NotFoundLayout,
  VoidAction,
  VoidDescription,
  VoidNumber,
} from './styles'

export function NotFoundPage() {
  const { t } = useTranslation('errors')

  return (
    <NotFoundLayout>
      <NotFoundContent>
        <VoidNumber aria-hidden="true">404</VoidNumber>

        <BaseBadge label={t('notFound.badge')} tone="neutral" />

        <BaseText as="h1" variant="title">
          {t('notFound.title')}
        </BaseText>

        <VoidDescription>{t('notFound.description')}</VoidDescription>

        <VoidAction to={ROUTES.conversations}>
          {t('notFound.action')}
        </VoidAction>
      </NotFoundContent>
    </NotFoundLayout>
  )
}
