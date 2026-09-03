import styled from 'styled-components'

import { microLabel, quietScrollbar } from '@/styles'

export const ListWrapper = styled.div`
  ${quietScrollbar};

  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  overflow-y: auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.workspace}) {
    padding-inline: ${({ theme }) => theme.spacing.md};
  }
`

export const ListStatus = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`

export const DayGroup = styled.section`
  display: flex;
  flex-direction: column;
`

export const DaySeparator = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: ${({ theme }) => `${theme.spacing.lg} 0 ${theme.spacing.xs}`};
  color: ${({ theme }) => theme.colors.textFaint};

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }

  &:first-child {
    margin-top: 0;
  }
`

export const DayLabel = styled.span`
  ${microLabel};
  font-size: 0.625rem;
  letter-spacing: 0.12em;
  white-space: nowrap;
`

/** Ancora do scroll: fica sempre no fim da lista. */
export const ScrollAnchor = styled.div`
  height: 1px;
  flex-shrink: 0;
`
