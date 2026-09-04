import { APP } from '@/constants'

export type DayBucket = 'today' | 'yesterday' | 'older'

const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000

/**
 * Chave estavel do dia local ("2026-09-03"). E o que separa a conversa em
 * blocos: duas mensagens com a mesma chave estao sob o mesmo cabecalho.
 */
export const getDayKey = (isoDate: string): string => {
  const date = new Date(isoDate)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

/**
 * Diz apenas em que faixa o dia cai. Quem traduz "hoje" e "ontem" e a UI —
 * util nao conhece i18n.
 */
export const getDayBucket = (isoDate: string): DayBucket => {
  const dayKey = getDayKey(isoDate)
  const now = Date.now()

  if (dayKey === getDayKey(new Date(now).toISOString())) return 'today'

  const yesterday = new Date(now - MILLISECONDS_IN_DAY).toISOString()

  if (dayKey === getDayKey(yesterday)) return 'yesterday'

  return 'older'
}

export const formatTime = (
  isoDate: string,
  locale: string = APP.defaultLocale,
): string =>
  new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoDate))

/** Data do separador de dia. O ano so aparece quando nao e o atual. */
export const formatDayDate = (
  isoDate: string,
  locale: string = APP.defaultLocale,
): string => {
  const date = new Date(isoDate)
  const isCurrentYear = date.getFullYear() === new Date().getFullYear()

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'long',
    year: isCurrentYear ? undefined : 'numeric',
  }).format(date)
}

/** Data compacta ("03/09"), para caber na linha da barra lateral. */
export const formatShortDate = (
  isoDate: string,
  locale: string = APP.defaultLocale,
): string =>
  new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
  }).format(new Date(isoDate))

export const formatDateTime = (
  isoDate: string,
  locale: string = APP.defaultLocale,
): string =>
  new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoDate))
