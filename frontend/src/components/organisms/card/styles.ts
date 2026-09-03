import styled from 'styled-components'

import { hairline, riseIn, surfaceCard } from '@/styles'

export const CardRootWrapper = styled.article`
  ${surfaceCard};

  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  max-width: ${({ theme }) => theme.layout.cardWidth};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.card};
  animation: ${riseIn} 480ms cubic-bezier(0.22, 1, 0.36, 1) both;

  @media (max-width: 32rem) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`

export const CardHeaderRow = styled.header`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`

export const CardBodySection = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

export const CardRule = styled.hr`
  ${hairline};
`

export const CardFooterRow = styled.footer`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
`
