import { useTranslation } from 'react-i18next'

import { BaseIcon } from '@/components/atoms'
import { ROUTES } from '@/constants'

import {
  BrandCopy,
  BrandGlyph,
  BrandName,
  BrandTagline,
  BrandWrapper,
} from './styles'

type BrandMarkProps = {
  /** Destino do clique. O cabecalho da area logada volta para as conversas. */
  to?: string
}

export function BrandMark({ to = ROUTES.conversations }: BrandMarkProps) {
  const { t } = useTranslation('common')

  return (
    <BrandWrapper to={to}>
      <BrandGlyph>
        <BaseIcon name="message" size={15} strokeWidth={1.8} />
      </BrandGlyph>

      <BrandCopy>
        <BrandName>{t('brand.name')}</BrandName>
        <BrandTagline>{t('brand.tagline')}</BrandTagline>
      </BrandCopy>
    </BrandWrapper>
  )
}
