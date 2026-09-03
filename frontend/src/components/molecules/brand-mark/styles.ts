import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { focusRing, microLabel } from '@/styles'

export const BrandWrapper = styled(Link)`
  ${focusRing};

  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  text-decoration: none;
  border-radius: ${({ theme }) => theme.radii.sm};
`

/** Duas conversas sobrepostas — a marca em 20px, sem arquivo externo. */
export const BrandGlyph = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: ${({ theme }) => theme.radii.sm};
  background-color: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.onDark};

  &::after {
    content: '';
    position: absolute;
    inset: auto 0.4rem 0.45rem;
    height: 2px;
    border-radius: 1px;
    background-color: currentColor;
    opacity: 0.45;
  }
`

export const BrandCopy = styled.span`
  display: flex;
  flex-direction: column;
  line-height: 1.2;
`

export const BrandName = styled.span`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: 500;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.text};
`

export const BrandTagline = styled.span`
  ${microLabel};
  font-size: 0.625rem;
  letter-spacing: 0.12em;
  color: ${({ theme }) => theme.colors.textFaint};
`
