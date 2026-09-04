import type { ChatParticipant } from '@/services/chats'
import { getDisplayNameFromEmail } from '@/utils'

/** A busca cobre o e-mail e o nome derivado dele, ambos em caixa baixa. */
export const matchesSearchTerm = (
  contact: ChatParticipant,
  term: string,
): boolean => {
  const displayName = getDisplayNameFromEmail(contact.email).toLowerCase()

  return (
    contact.email.toLowerCase().includes(term) || displayName.includes(term)
  )
}
