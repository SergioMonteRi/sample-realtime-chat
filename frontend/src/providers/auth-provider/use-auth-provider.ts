import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { i18n } from '@/i18n'
import type { Session } from '@/services/auth'
import { authSessionStorage } from '@/services/auth'
import { setUnauthorizedHandler } from '@/services/http'

import type { AuthContextValue } from './auth-context'

export const useAuthProvider = (): AuthContextValue => {
  const queryClient = useQueryClient()
  const [session, setSession] = useState<Session | null>(() =>
    authSessionStorage.read(),
  )

  const signIn = useCallback((nextSession: Session) => {
    authSessionStorage.write(nextSession)
    setSession(nextSession)
  }, [])

  const signOut = useCallback(() => {
    authSessionStorage.clear()
    setSession(null)
  }, [])

  /**
   * O cookie de sessao vive mais tempo que a aba, mas pode cair antes dela.
   * Quando o backend recusa uma chamada, a identidade local e descartada e o
   * `ProtectedRoute` leva a pessoa de volta ao login — sem nenhuma tela
   * precisar tratar 401 por conta propria.
   */
  useEffect(() => {
    const handleUnauthorized = () => {
      /* Sem sessao guardada, o 401 e esperado e nao ha o que avisar. */
      if (!authSessionStorage.read()) return

      authSessionStorage.clear()
      setSession(null)
      queryClient.clear()

      toast.error(i18n.t('auth:errors.sessionExpired'))
    }

    setUnauthorizedHandler(handleUnauthorized)

    return () => setUnauthorizedHandler(null)
  }, [queryClient])

  return useMemo(
    () => ({
      session,
      isAuthenticated: Boolean(session),
      signIn,
      signOut,
    }),
    [session, signIn, signOut],
  )
}
