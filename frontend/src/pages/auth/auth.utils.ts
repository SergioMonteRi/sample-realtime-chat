import type { ApiErrorKind } from '@/services/http'
import { getApiErrorKind } from '@/services/http'

/**
 * Traduz a falha da chamada em uma chave de mensagem. As telas de
 * autenticacao mostram o erro dentro do proprio cartao — por isso nenhuma
 * mutation de login ou cadastro declara `meta.errorMessageKey`: haveria
 * toast e mensagem inline dizendo a mesma coisa.
 */
const MESSAGE_KEY_BY_ERROR_KIND: Partial<Record<ApiErrorKind, string>> = {
  network: 'errors.networkFailed',
  unauthorized: 'errors.invalidCredentials',
  validation: 'errors.invalidData',
}

export const getAuthErrorMessageKey = (
  error: unknown,
  fallbackKey: string,
): string => MESSAGE_KEY_BY_ERROR_KIND[getApiErrorKind(error)] ?? fallbackKey
