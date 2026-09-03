import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { i18n } from '@/i18n'
import type { ApiErrorKind } from '@/services/http'
import { normalizeApiError } from '@/services/http'

interface ErrorMessageMeta {
  errorMessageKey?: string
  errorMessageKeys?: Partial<Record<ApiErrorKind, string>>
}

/**
 * Feedback de erro centralizado: quem dispara a chamada apenas declara
 * `meta.errorMessageKey`; a traducao e o toast acontecem aqui, uma vez so.
 * Telas que mostram o erro inline nao declaram `meta` e nao geram toast.
 */
const notifyError = (error: unknown, meta?: ErrorMessageMeta) => {
  const { kind } = normalizeApiError(error)

  /* Sessao expirada ja tem aviso proprio no AuthProvider. */
  if (kind === 'unauthorized') return

  const messageKey = meta?.errorMessageKeys?.[kind] ?? meta?.errorMessageKey

  if (messageKey) toast.error(i18n.t(messageKey))
}

const notifySuccess = (messageKey?: string) => {
  if (messageKey) toast.success(i18n.t(messageKey))
}

export const createQueryClient = (): QueryClient =>
  new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => notifyError(error, query.meta),
    }),
    mutationCache: new MutationCache({
      onError: (error, _variables, _onMutateResult, mutation) =>
        notifyError(error, mutation.meta),
      onSuccess: (_data, _variables, _onMutateResult, mutation) =>
        notifySuccess(mutation.meta?.successMessageKey),
    }),
    defaultOptions: {
      queries: {
        staleTime: 15_000,
        refetchOnWindowFocus: true,
        retry: 1,
      },
      mutations: {
        retry: 0,
      },
    },
  })
