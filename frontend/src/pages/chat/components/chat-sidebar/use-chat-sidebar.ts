import { useState } from 'react'

import type { User } from '@/services/users'

import { matchesSearchTerm } from './chat-sidebar.utils'

interface UseChatSidebarParams {
  contacts: User[]
}

interface UseChatSidebarReturn {
  searchTerm: string
  filteredContacts: User[]
  hasSearchTerm: boolean
  handleSearchChange: (term: string) => void
}

export const useChatSidebar = ({
  contacts,
}: UseChatSidebarParams): UseChatSidebarReturn => {
  /* Estado de interface, e nao de servidor: `useState` e o lugar certo. */
  const [searchTerm, setSearchTerm] = useState('')

  const normalizedTerm = searchTerm.trim().toLowerCase()

  return {
    searchTerm,
    filteredContacts: normalizedTerm
      ? contacts.filter((contact) => matchesSearchTerm(contact, normalizedTerm))
      : contacts,
    hasSearchTerm: normalizedTerm.length > 0,
    handleSearchChange: setSearchTerm,
  }
}
