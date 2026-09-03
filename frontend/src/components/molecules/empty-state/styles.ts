import styled from 'styled-components'

import { fadeIn, riseIn } from '@/styles'

export const EmptyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing.lg}`};
  text-align: center;
  animation: ${fadeIn} 420ms ease both;
`

export const EmptyMark = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  margin-bottom: ${({ theme }) => theme.spacing.xxs};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.pill};
  color: ${({ theme }) => theme.colors.textFaint};
  background-color: ${({ theme }) => theme.colors.surface};
  animation: ${riseIn} 480ms cubic-bezier(0.22, 1, 0.36, 1) both;
`

export const EmptyDescription = styled.p`
  max-width: 34ch;
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textMuted};
`

export const EmptyActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  padding-top: ${({ theme }) => theme.spacing.xs};
`
