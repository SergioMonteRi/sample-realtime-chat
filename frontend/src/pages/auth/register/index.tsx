import { useTranslation } from 'react-i18next'

import { BaseText } from '@/components/atoms'
import { Card } from '@/components/organisms'
import { ROUTES } from '@/constants'

import { RegisterForm } from './components'
import { FooterLink, FooterQuestion } from './styles'

export function RegisterPage() {
  const { t } = useTranslation('auth')

  return (
    <Card.Root>
      <Card.Header>
        <BaseText variant="micro" tone="accent">
          {t('register.eyebrow')}
        </BaseText>

        <BaseText as="h1" variant="title">
          {t('register.title')}
        </BaseText>

        <BaseText tone="muted">{t('register.description')}</BaseText>
      </Card.Header>

      <Card.Section>
        <RegisterForm />
      </Card.Section>

      <Card.Divider />

      <Card.Footer>
        <FooterQuestion>{t('register.hasAccount')}</FooterQuestion>
        <FooterLink to={ROUTES.login}>{t('register.goToLogin')}</FooterLink>
      </Card.Footer>
    </Card.Root>
  )
}
