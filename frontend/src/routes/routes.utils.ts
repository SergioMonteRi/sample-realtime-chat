import { ROUTES } from '@/constants'

/**
 * O `ProtectedRoute` guarda a rota tentada em `location.state`. Como o state
 * do roteador e `unknown` por natureza (o usuario pode ter chegado por um
 * historico antigo), a leitura e defensiva.
 */
export const getRedirectPath = (state: unknown): string => {
  if (typeof state !== 'object' || state === null) return ROUTES.conversations

  const { from } = state as { from?: unknown }

  return typeof from === 'string' && from.startsWith('/')
    ? from
    : ROUTES.conversations
}
