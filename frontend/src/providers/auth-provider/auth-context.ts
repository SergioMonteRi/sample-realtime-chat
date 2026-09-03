import { createContext } from 'react'

import type { Session } from '@/services/auth'

export interface AuthContextValue {
  session: Session | null
  isAuthenticated: boolean
  /** Chamado apos o `POST /auth/login` responder com sucesso. */
  signIn: (session: Session) => void
  /** Esquece a identidade local. Nao chama o backend — quem faz isso e a mutation. */
  signOut: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
