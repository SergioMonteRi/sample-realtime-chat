import styled from 'styled-components'

import { hairline, microLabel } from '@/styles'

export const PlainRule = styled.hr`
  ${hairline};
`

export const LabelledRule = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textFaint};

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }
`

export const RuleLabel = styled.span`
  ${microLabel};
  letter-spacing: 0.1em;
  white-space: nowrap;
`
