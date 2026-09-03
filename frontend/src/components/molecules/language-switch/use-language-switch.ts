import { useTranslation } from 'react-i18next'

import type { SupportedLocale } from '@/i18n'
import { SUPPORTED_LOCALES } from '@/i18n'

interface UseLanguageSwitchReturn {
  locales: readonly SupportedLocale[]
  currentLocale: string
  handleChangeLocale: (locale: SupportedLocale) => void
}

export const useLanguageSwitch = (): UseLanguageSwitchReturn => {
  const { i18n } = useTranslation()

  const handleChangeLocale = (locale: SupportedLocale) => {
    void i18n.changeLanguage(locale)
    document.documentElement.lang = locale
  }

  return {
    locales: SUPPORTED_LOCALES,
    currentLocale: i18n.resolvedLanguage ?? i18n.language,
    handleChangeLocale,
  }
}
