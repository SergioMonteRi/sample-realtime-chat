import { getDisplayNameFromEmail } from '@/utils'

import type { SidebarEntry } from '../../use-chat'

/** A busca cobre o e-mail e o nome derivado dele, ambos em caixa baixa. */
export const matchesSearchTerm = (
  entry: SidebarEntry,
  term: string,
): boolean => {
  const { email } = entry.contact
  const displayName = getDisplayNameFromEmail(email).toLowerCase()

  return email.toLowerCase().includes(term) || displayName.includes(term)
}
