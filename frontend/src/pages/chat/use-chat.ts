import { useNavigate, useParams } from 'react-router-dom'

import { buildConversationRoute } from '@/constants'
import type { User } from '@/services/users'
import { useUsersQuery } from '@/services/users'

interface UseChatReturn {
  contacts: User[]
  selectedContact: User | undefined
  selectedContactId: string | undefined
  isLoadingContacts: boolean
  hasContactsError: boolean
  handleSelectContact: (contactId: string) => void
  handleRetryContacts: () => void
}

export const useChat = (): UseChatReturn => {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()

  const { data: contacts, isLoading, isError, refetch } = useUsersQuery()

  const handleSelectContact = (contactId: string) => {
    void navigate(buildConversationRoute(contactId))
  }

  const handleRetryContacts = () => {
    void refetch()
  }

  return {
    contacts: contacts ?? [],
    /**
     * A rota guarda o id do contato; a conversa so abre quando ele aparece
     * na lista carregada — um link antigo para alguem que nao existe mais
     * cai no estado vazio, sem quebrar a tela.
     */
    selectedContact: contacts?.find((contact) => contact.id === userId),
    selectedContactId: userId,
    isLoadingContacts: isLoading,
    hasContactsError: isError,
    handleSelectContact,
    handleRetryContacts,
  }
}
