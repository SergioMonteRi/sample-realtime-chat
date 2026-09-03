import { STORAGE_KEYS } from '@/constants'
import { localStorageUtils } from '@/utils'

import { sessionSchema } from './auth.schemas'
import type { Session } from './auth.types'

/**
 * Persistencia da identidade exibida na interface. Sobrevive ao reload
 * porque o cookie de sessao tambem sobrevive — se um dos dois cair, o
 * primeiro 401 recoloca os dois no mesmo estado (ver `AuthProvider`).
 */
export const authSessionStorage = {
  read(): Session | null {
    const stored = localStorageUtils.get<unknown>(STORAGE_KEYS.session)

    if (!stored) return null

    /* Formato antigo ou corrompido nao pode derrubar a aplicacao. */
    const session = sessionSchema.safeParse(stored)

    return session.success ? session.data : null
  },

  write(session: Session): void {
    localStorageUtils.set(STORAGE_KEYS.session, session)
  },

  clear(): void {
    localStorageUtils.remove(STORAGE_KEYS.session)
  },
}
