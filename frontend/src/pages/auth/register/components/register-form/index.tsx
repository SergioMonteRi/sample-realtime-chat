import { useTranslation } from 'react-i18next'

import { BaseButton, BaseTextInput } from '@/components/atoms'

import { FormElement, FormError } from './styles'
import { useRegisterForm } from './use-register-form'

export function RegisterForm() {
  const { t } = useTranslation('auth')

  const {
    emailField,
    passwordField,
    confirmPasswordField,
    emailError,
    passwordError,
    confirmPasswordError,
    requestErrorMessage,
    passwordMinLength,
    isPending,
    handleSubmitForm,
  } = useRegisterForm()

  return (
    <FormElement onSubmit={handleSubmitForm} noValidate>
      <BaseTextInput
        {...emailField}
        type="email"
        label={t('register.emailLabel')}
        placeholder={t('register.emailPlaceholder')}
        errorMessage={emailError}
        autoComplete="email"
        autoFocus
      />

      <BaseTextInput
        {...passwordField}
        type="password"
        label={t('register.passwordLabel')}
        placeholder={t('register.passwordPlaceholder', {
          count: passwordMinLength,
        })}
        hint={t('register.passwordHint', { count: passwordMinLength })}
        errorMessage={passwordError}
        autoComplete="new-password"
      />

      <BaseTextInput
        {...confirmPasswordField}
        type="password"
        label={t('register.confirmPasswordLabel')}
        placeholder={t('register.confirmPasswordPlaceholder')}
        errorMessage={confirmPasswordError}
        autoComplete="new-password"
      />

      {requestErrorMessage && (
        <FormError role="alert">{requestErrorMessage}</FormError>
      )}

      <BaseButton type="submit" isFullWidth isLoading={isPending}>
        {isPending ? t('register.submitting') : t('register.submit')}
      </BaseButton>
    </FormElement>
  )
}
