import { EMAIL_LOCAL_PART_REGEX } from '@/constants'

const NAME_SEPARATORS_REGEX = /[._\-+]+/

export const capitalize = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1)

/**
 * O backend so guarda e-mail, entao o nome exibido nasce dele:
 * "ana.souza@exemplo.com" vira "Ana Souza".
 */
export const getDisplayNameFromEmail = (email: string): string => {
  const [, localPart] = EMAIL_LOCAL_PART_REGEX.exec(email) ?? []

  if (!localPart) return email

  const words = localPart
    .split(NAME_SEPARATORS_REGEX)
    .filter(Boolean)
    .map(capitalize)

  return words.length > 0 ? words.join(' ') : email
}

/** Iniciais do avatar — no maximo duas letras. */
export const getInitials = (value: string): string => {
  const words = value.trim().split(/\s+/).filter(Boolean)

  const [first, second] = words

  if (!first) return '?'

  const initials = second
    ? `${first.charAt(0)}${second.charAt(0)}`
    : first.slice(0, 2)

  return initials.toUpperCase()
}

export const truncate = (value: string, maxLength: number): string =>
  value.length <= maxLength ? value : `${value.slice(0, maxLength - 1)}…`
