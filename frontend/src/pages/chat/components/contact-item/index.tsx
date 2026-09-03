import { BaseAvatar } from '@/components/atoms'
import type { User } from '@/services/users'
import { getDisplayNameFromEmail } from '@/utils'

import { ContactButton, ContactCopy, ContactEmail, ContactName } from './styles'

type ContactItemProps = {
  contact: User
  isActive: boolean
  label: string
  onSelect: (contactId: string) => void
}

export function ContactItem({
  contact,
  isActive,
  label,
  onSelect,
}: ContactItemProps) {
  const displayName = getDisplayNameFromEmail(contact.email)

  const handleSelect = () => {
    onSelect(contact.id)
  }

  return (
    <ContactButton
      type="button"
      onClick={handleSelect}
      aria-current={isActive ? 'true' : undefined}
      aria-label={label}
      $isActive={isActive}
    >
      <BaseAvatar name={displayName} seed={contact.id} size="md" />

      <ContactCopy>
        <ContactName>{displayName}</ContactName>
        <ContactEmail>{contact.email}</ContactEmail>
      </ContactCopy>
    </ContactButton>
  )
}
