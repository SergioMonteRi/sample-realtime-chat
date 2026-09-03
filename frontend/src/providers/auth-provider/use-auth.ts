import { useContext } from 'react'

import type { AuthContextValue } from './auth-context'
import { AuthContext } from './auth-context'

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth precisa estar dentro de <AuthProvider>')
  }

  return context
}
