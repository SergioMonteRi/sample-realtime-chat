import { useTranslation } from 'react-i18next'

import type { SupportedLocale } from '@/i18n'

import { SwitchOption, SwitchWrapper } from './styles'
import { useLanguageSwitch } from './use-language-switch'

const LOCALE_LABEL_KEY: Record<SupportedLocale, string> = {
  'pt-BR': 'language.ptBR',
  'en-US': 'language.enUS',
}

export function LanguageSwitch() {
  const { t } = useTranslation('common')
  const { locales, currentLocale, handleChangeLocale } = useLanguageSwitch()

  return (
    <SwitchWrapper role="group" aria-label={t('language.label')}>
      {locales.map((locale) => (
        <SwitchOption
          key={locale}
          type="button"
          lang={locale}
          aria-pressed={locale === currentLocale}
          $isActive={locale === currentLocale}
          onClick={() => handleChangeLocale(locale)}
        >
          {t(LOCALE_LABEL_KEY[locale])}
        </SwitchOption>
      ))}
    </SwitchWrapper>
  )
}
