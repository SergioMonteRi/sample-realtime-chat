import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'

import { BrandMark, LanguageSwitch } from '@/components/molecules'
import { ROUTES } from '@/constants'

import {
  FooterNote,
  LayoutFooter,
  LayoutHeader,
  LayoutMain,
  LayoutWrapper,
} from './styles'

/** Moldura das telas publicas: marca, idioma e um cartao centralizado. */
export function AuthLayout() {
  const { t } = useTranslation('common')

  return (
    <LayoutWrapper>
      <LayoutHeader>
        <BrandMark to={ROUTES.login} />
        <LanguageSwitch />
      </LayoutHeader>

      <LayoutMain>
        <Outlet />
      </LayoutMain>

      <LayoutFooter>
        <FooterNote>{t('footer.note')}</FooterNote>
      </LayoutFooter>
    </LayoutWrapper>
  )
}
