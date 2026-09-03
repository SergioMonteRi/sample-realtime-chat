import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { focusRing, truncate } from '@/styles'

export const HeaderWrapper = styled.header`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-shrink: 0;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.canvas};

  @media (max-width: ${({ theme }) => theme.breakpoints.workspace}) {
    padding-inline: ${({ theme }) => theme.spacing.md};
  }
`

/** Só faz sentido quando a lista de contatos saiu de cena. */
export const BackLink = styled(Link)`
  ${focusRing};

  display: none;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  margin-left: -0.25rem;
  border-radius: ${({ theme }) => theme.radii.sm};
  color: ${({ theme }) => theme.colors.textMuted};

  @media (max-width: ${({ theme }) => theme.breakpoints.workspace}) {
    display: inline-flex;
  }
`

export const HeaderCopy = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
`

export const HeaderName = styled.h1`
  ${truncate};
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: 400;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.text};
`

export const HeaderEmail = styled.span`
  ${truncate};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textFaint};
`

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const RealtimeNotice = styled.p`
  max-width: 22rem;
  margin: 0;
  text-align: right;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.textFaint};

  @media (max-width: 64rem) {
    display: none;
  }
`
