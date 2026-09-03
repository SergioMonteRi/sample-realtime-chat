import styled from 'styled-components'

import { spin } from '@/styles'

export const SpinnerRing = styled.span<{ $size: number }>`
  display: inline-block;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.textMuted};
  border-radius: 50%;
  animation: ${spin} 800ms linear infinite;
`
