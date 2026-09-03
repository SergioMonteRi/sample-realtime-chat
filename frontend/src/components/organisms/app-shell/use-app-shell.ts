import { useAuth } from '@/providers'
import { useLogoutMutation } from '@/services/auth'
import { getDisplayNameFromEmail } from '@/utils'

interface UseAppShellReturn {
  email: string
  displayName: string
  isSigningOut: boolean
  handleSignOut: () => void
}

export const useAppShell = (): UseAppShellReturn => {
  const { session, signOut } = useAuth()
  const { mutate: logout, isPending } = useLogoutMutation()

  const email = session?.email ?? ''

  /**
   * A sessao local cai no `onSettled`, e nao so no sucesso: se a chamada
   * falhar, insistir em manter o usuario "logado" na interface seria pior —
   * o proximo 401 o expulsaria de qualquer forma.
   */
  const handleSignOut = () => {
    logout(undefined, { onSettled: signOut })
  }

  return {
    email,
    displayName: getDisplayNameFromEmail(email),
    isSigningOut: isPending,
    handleSignOut,
  }
}
