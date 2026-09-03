import styled from 'styled-components'

import { fadeIn } from '@/styles'

export const LayoutWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
`

export const LayoutHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing.lg}`};
  animation: ${fadeIn} 500ms ease both;
`

export const LayoutMain = styled.main`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing.lg}`};
`

export const LayoutFooter = styled.footer`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  text-align: center;
`

export const FooterNote = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textFaint};
`
