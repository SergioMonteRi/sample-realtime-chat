import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { APP, ROUTES } from '@/constants'
import { useRegisterMutation } from '@/services/auth'

import { getAuthErrorMessageKey } from '../../../auth.utils'
import type { RegisterFormData } from '../../register.schema'
import { registerSchema } from '../../register.schema'

export const useRegisterForm = () => {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()

  const { register, handleSubmit, formState } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
    mode: 'onSubmit',
  })

  const { mutate: createAccount, isPending, error } = useRegisterMutation()

  /**
   * O backend nao autentica quem acabou de se cadastrar (`/auth/register` so
   * cria o usuario), entao o proximo passo e a tela de login. O aviso de
   * sucesso vem do `meta.successMessageKey` da mutation.
   */
  const handleRegister = ({ email, password }: RegisterFormData) => {
    createAccount(
      { email, password },
      { onSuccess: () => void navigate(ROUTES.login, { replace: true }) },
    )
  }

  /* `count` alimenta a mensagem de tamanho minimo; as demais chaves o ignoram. */
  const translateFieldError = (messageKey?: string) =>
    messageKey ? t(messageKey, { count: APP.passwordMinLength }) : undefined

  return {
    emailField: register('email'),
    passwordField: register('password'),
    confirmPasswordField: register('confirmPassword'),
    emailError: translateFieldError(formState.errors.email?.message),
    passwordError: translateFieldError(formState.errors.password?.message),
    confirmPasswordError: translateFieldError(
      formState.errors.confirmPassword?.message,
    ),
    requestErrorMessage: error
      ? t(getAuthErrorMessageKey(error, 'errors.registerFailed'))
      : undefined,
    passwordMinLength: APP.passwordMinLength,
    isPending,
    handleSubmitForm: handleSubmit(handleRegister),
  }
}
