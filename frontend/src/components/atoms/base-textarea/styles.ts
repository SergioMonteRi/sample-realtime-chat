import styled, { css } from 'styled-components'

import { quietScrollbar, visuallyHidden } from '@/styles'

export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxs};
  width: 100%;
`

export const HiddenLabel = styled.label`
  ${visuallyHidden};
`

export const StyledTextarea = styled.textarea<{ $hasError: boolean }>`
  ${quietScrollbar};

  width: 100%;
  min-height: 2.75rem;
  padding: ${({ theme }) => `${theme.spacing.xs} 0`};
  border: none;
  background: none;
  outline: none;
  resize: none;
  overflow-y: hidden;
  font-size: ${({ theme }) => theme.fontSizes.md};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textFaint};
  }

  ${({ $hasError }) =>
    $hasError &&
    css`
      color: ${({ theme }) => theme.colors.danger};
    `}
`

export const FieldMessage = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.danger};
`
