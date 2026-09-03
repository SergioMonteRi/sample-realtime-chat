import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { APP } from '@/constants'

import enUSAuth from './locales/en-US/auth.json'
import enUSChat from './locales/en-US/chat.json'
import enUSCommon from './locales/en-US/common.json'
import enUSErrors from './locales/en-US/errors.json'
import ptBRAuth from './locales/pt-BR/auth.json'
import ptBRChat from './locales/pt-BR/chat.json'
import ptBRCommon from './locales/pt-BR/common.json'
import ptBRErrors from './locales/pt-BR/errors.json'

export const SUPPORTED_LOCALES = ['pt-BR', 'en-US'] as const

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

const resources = {
  'pt-BR': {
    common: ptBRCommon,
    auth: ptBRAuth,
    chat: ptBRChat,
    errors: ptBRErrors,
  },
  'en-US': {
    common: enUSCommon,
    auth: enUSAuth,
    chat: enUSChat,
    errors: enUSErrors,
  },
} as const

void i18n.use(initReactI18next).init({
  resources,
  lng: APP.defaultLocale,
  fallbackLng: APP.defaultLocale,
  supportedLngs: SUPPORTED_LOCALES,
  defaultNS: 'common',
  ns: ['common', 'auth', 'chat', 'errors'],
  interpolation: { escapeValue: false },
})

export { i18n }
