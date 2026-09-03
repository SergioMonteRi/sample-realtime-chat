import styled, { css } from 'styled-components'

import { microLabel, riseIn } from '@/styles'

interface FieldProps {
  $hasError: boolean
}

export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  width: 100%;
`

export const FieldLabel = styled.label`
  ${microLabel};
  color: ${({ theme }) => theme.colors.textMuted};
`

export const InputShell = styled.div<FieldProps>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `0 ${theme.spacing.md}`};
  min-height: 2.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textFaint};
  transition:
    border-color ${({ theme }) => theme.transitions.fast},
    box-shadow ${({ theme }) => theme.transitions.fast};

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accentSoft};
  }

  ${({ $hasError }) =>
    $hasError &&
    css`
      border-color: ${({ theme }) => theme.colors.danger};

      &:focus-within {
        border-color: ${({ theme }) => theme.colors.danger};
        box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.dangerSoft};
      }
    `}
`

export const InputLeading = styled.span`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
`

export const StyledInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: 0;
  border: none;
  background: none;
  outline: none;
  font-size: ${({ theme }) => theme.fontSizes.md};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textFaint};
  }
`

export const FieldMessage = styled.span<FieldProps>`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  line-height: 1.5;
  animation: ${riseIn} ${({ theme }) => theme.transitions.base} both;
  color: ${({ theme, $hasError }) =>
    $hasError ? theme.colors.danger : theme.colors.textFaint};
`
