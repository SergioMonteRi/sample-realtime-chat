import { useTranslation } from 'react-i18next'

import { BaseButton, BaseTextInput } from '@/components/atoms'

import { FormElement, FormError } from './styles'
import { useLoginForm } from './use-login-form'

export function LoginForm() {
  const { t } = useTranslation('auth')

  const {
    emailField,
    passwordField,
    emailError,
    passwordError,
    requestErrorMessage,
    isPending,
    handleSubmitForm,
  } = useLoginForm()

  return (
    <FormElement onSubmit={handleSubmitForm} noValidate>
      <BaseTextInput
        {...emailField}
        type="email"
        label={t('login.emailLabel')}
        placeholder={t('login.emailPlaceholder')}
        errorMessage={emailError}
        autoComplete="email"
        autoFocus
      />

      <BaseTextInput
        {...passwordField}
        type="password"
        label={t('login.passwordLabel')}
        placeholder={t('login.passwordPlaceholder')}
        errorMessage={passwordError}
        autoComplete="current-password"
      />

      {requestErrorMessage && (
        <FormError role="alert">{requestErrorMessage}</FormError>
      )}

      <BaseButton type="submit" isFullWidth isLoading={isPending}>
        {isPending ? t('login.submitting') : t('login.submit')}
      </BaseButton>
    </FormElement>
  )
}
