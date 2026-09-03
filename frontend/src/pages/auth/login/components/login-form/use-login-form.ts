import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@/providers'
import { useLoginMutation } from '@/services/auth'

import { getAuthErrorMessageKey } from '../../../auth.utils'
import type { LoginFormData } from '../../login.schema'
import { loginSchema } from '../../login.schema'

export const useLoginForm = () => {
  const { t } = useTranslation('auth')
  const { signIn } = useAuth()

  const { register, handleSubmit, formState } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onSubmit',
  })

  const { mutate: login, isPending, error } = useLoginMutation()

  /**
   * Nao ha navegacao aqui: assim que a sessao existe, o `PublicOnlyRoute`
   * leva a pessoa para as conversas (ou de volta para a rota que ela tentou
   * abrir antes). Redirecionamento mora no roteador, nao no formulario.
   */
  const handleLogin = ({ email, password }: LoginFormData) => {
    login({ email, password }, { onSuccess: () => signIn({ email }) })
  }

  const translateFieldError = (messageKey?: string) =>
    messageKey ? t(messageKey) : undefined

  return {
    emailField: register('email'),
    passwordField: register('password'),
    emailError: translateFieldError(formState.errors.email?.message),
    passwordError: translateFieldError(formState.errors.password?.message),
    requestErrorMessage: error
      ? t(getAuthErrorMessageKey(error, 'errors.loginFailed'))
      : undefined,
    isPending,
    handleSubmitForm: handleSubmit(handleLogin),
  }
}
