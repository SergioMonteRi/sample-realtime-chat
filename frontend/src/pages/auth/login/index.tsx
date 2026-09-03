import { useTranslation } from 'react-i18next'

import { BaseText } from '@/components/atoms'
import { Card } from '@/components/organisms'
import { ROUTES } from '@/constants'

import { LoginForm } from './components'
import { FooterLink, FooterQuestion } from './styles'

export function LoginPage() {
  const { t } = useTranslation('auth')

  return (
    <Card.Root>
      <Card.Header>
        <BaseText variant="micro" tone="accent">
          {t('login.eyebrow')}
        </BaseText>

        <BaseText as="h1" variant="title">
          {t('login.title')}
        </BaseText>

        <BaseText tone="muted">{t('login.description')}</BaseText>
      </Card.Header>

      <Card.Section>
        <LoginForm />
      </Card.Section>

      <Card.Divider />

      <Card.Footer>
        <FooterQuestion>{t('login.noAccount')}</FooterQuestion>
        <FooterLink to={ROUTES.register}>{t('login.goToRegister')}</FooterLink>
      </Card.Footer>
    </Card.Root>
  )
}
