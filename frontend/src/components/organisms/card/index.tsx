/* eslint-disable react-refresh/only-export-components --
   Composition Pattern: este arquivo exporta o objeto `Card`, e nao
   componentes soltos. O Fast Refresh nao consegue rastrear esse formato. */
import type { ReactNode } from 'react'

import {
  CardBodySection,
  CardFooterRow,
  CardHeaderRow,
  CardRootWrapper,
  CardRule,
} from './styles'

type WithChildren = { children: ReactNode }

function Root({ children }: WithChildren) {
  return <CardRootWrapper>{children}</CardRootWrapper>
}

function Header({ children }: WithChildren) {
  return <CardHeaderRow>{children}</CardHeaderRow>
}

function Section({ children }: WithChildren) {
  return <CardBodySection>{children}</CardBodySection>
}

function Divider() {
  return <CardRule />
}

function Footer({ children }: WithChildren) {
  return <CardFooterRow>{children}</CardFooterRow>
}

/**
 * Composition Pattern: cada parte do cartao e montada por quem consome,
 * sem uma lista crescente de props no componente raiz.
 */
export const Card = {
  Root,
  Header,
  Section,
  Divider,
  Footer,
}
