import styled, { css } from 'styled-components'

import { focusRing, spin } from '@/styles'

export type BaseButtonVariant = 'primary' | 'secondary' | 'quiet' | 'link'
export type BaseButtonSize = 'sm' | 'md' | 'icon'

interface StyledButtonProps {
  $variant: BaseButtonVariant
  $size: BaseButtonSize
  $isFullWidth: boolean
}

const variantStyles = {
  primary: css`
    background-color: ${({ theme }) => theme.colors.ink};
    color: ${({ theme }) => theme.colors.onDark};
    border: 1px solid transparent;

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.inkHover};
    }
  `,
  secondary: css`
    background-color: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text};
    border: 1px solid ${({ theme }) => theme.colors.border};

    &:hover:not(:disabled) {
      border-color: ${({ theme }) => theme.colors.borderStrong};
      background-color: ${({ theme }) => theme.colors.surfaceMuted};
    }
  `,
  quiet: css`
    background-color: transparent;
    color: ${({ theme }) => theme.colors.textMuted};
    border: 1px solid transparent;

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.surfaceMuted};
      color: ${({ theme }) => theme.colors.text};
    }
  `,
  link: css`
    background: none;
    border: 1px solid transparent;
    color: ${({ theme }) => theme.colors.accent};
    padding-inline: 0;
    min-height: auto;

    &:hover:not(:disabled) {
      color: ${({ theme }) => theme.colors.accentStrong};
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  `,
} as const satisfies Record<BaseButtonVariant, ReturnType<typeof css>>

const sizeStyles = {
  sm: css`
    min-height: 2.25rem;
    padding: 0 ${({ theme }) => theme.spacing.md};
    font-size: ${({ theme }) => theme.fontSizes.sm};
  `,
  md: css`
    min-height: 2.75rem;
    padding: 0 ${({ theme }) => theme.spacing.lg};
    font-size: ${({ theme }) => theme.fontSizes.md};
  `,
  icon: css`
    width: 2.375rem;
    height: 2.375rem;
    min-height: auto;
    padding: 0;
  `,
} as const satisfies Record<BaseButtonSize, ReturnType<typeof css>>

export const StyledButton = styled.button<StyledButtonProps>`
  ${focusRing};

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  width: ${({ $isFullWidth }) => ($isFullWidth ? '100%' : 'auto')};
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 600;
  letter-spacing: -0.005em;
  transition:
    background-color ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast},
    border-color ${({ theme }) => theme.transitions.fast},
    opacity ${({ theme }) => theme.transitions.fast};

  ${({ $size }) => sizeStyles[$size]};
  ${({ $variant }) => variantStyles[$variant]};

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }
`

export const ButtonSpinner = styled.span`
  width: 0.8125rem;
  height: 0.8125rem;
  border: 1.5px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: ${spin} 720ms linear infinite;
`
