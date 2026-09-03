import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { fadeIn, focusRing, riseIn } from '@/styles'

export const NotFoundLayout = styled.main`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
`

export const NotFoundContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  max-width: 34rem;
  text-align: center;
`

export const VoidNumber = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ theme }) => theme.fontSizes.hero};
  font-weight: 300;
  line-height: 0.9;
  letter-spacing: -0.04em;
  color: ${({ theme }) => theme.colors.borderStrong};
  animation: ${fadeIn} 700ms ease both;
`

export const VoidDescription = styled.p`
  max-width: 42ch;
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.md};
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.textMuted};
  animation: ${riseIn} 560ms cubic-bezier(0.22, 1, 0.36, 1) 160ms both;
`

export const VoidAction = styled(Link)`
  ${focusRing};

  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  min-height: 2.75rem;
  margin-top: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `0 ${theme.spacing.lg}`};
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ theme }) => theme.colors.ink};
  color: ${({ theme }) => theme.colors.onDark};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 600;
  text-decoration: none;
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.inkHover};
  }
`
