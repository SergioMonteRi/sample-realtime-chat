import type { ReactNode } from 'react'

import { AuthContext } from './auth-context'
import { useAuthProvider } from './use-auth-provider'

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const value = useAuthProvider()

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
