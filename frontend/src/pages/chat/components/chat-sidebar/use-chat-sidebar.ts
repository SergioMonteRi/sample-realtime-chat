import { useState } from 'react'

import type { SidebarEntry } from '../../use-chat'
import { matchesSearchTerm } from './chat-sidebar.utils'

interface UseChatSidebarParams {
  entries: SidebarEntry[]
}

interface UseChatSidebarReturn {
  searchTerm: string
  filteredEntries: SidebarEntry[]
  hasSearchTerm: boolean
  handleSearchChange: (term: string) => void
}

export const useChatSidebar = ({
  entries,
}: UseChatSidebarParams): UseChatSidebarReturn => {
  /* Estado de interface, e nao de servidor: `useState` e o lugar certo. */
  const [searchTerm, setSearchTerm] = useState('')

  const normalizedTerm = searchTerm.trim().toLowerCase()

  return {
    searchTerm,
    filteredEntries: normalizedTerm
      ? entries.filter((entry) => matchesSearchTerm(entry, normalizedTerm))
      : entries,
    hasSearchTerm: normalizedTerm.length > 0,
    handleSearchChange: setSearchTerm,
  }
}
