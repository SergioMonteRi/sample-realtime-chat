import type { User } from '@/services/users'
import { getDisplayNameFromEmail } from '@/utils'

/** A busca cobre o e-mail e o nome derivado dele, ambos em caixa baixa. */
export const matchesSearchTerm = (contact: User, term: string): boolean => {
  const displayName = getDisplayNameFromEmail(contact.email).toLowerCase()

  return (
    contact.email.toLowerCase().includes(term) || displayName.includes(term)
  )
}
