import type { ButtonHTMLAttributes, ReactNode } from 'react'

import type { BaseButtonSize, BaseButtonVariant } from './styles'
import { ButtonSpinner, StyledButton } from './styles'

type BaseButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: BaseButtonVariant
  size?: BaseButtonSize
  isFullWidth?: boolean
  isLoading?: boolean
}

export function BaseButton({
  children,
  variant = 'primary',
  size = 'md',
  isFullWidth = false,
  isLoading = false,
  disabled,
  type = 'button',
  ...buttonProps
}: BaseButtonProps) {
  return (
    <StyledButton
      {...buttonProps}
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      $variant={variant}
      $size={size}
      $isFullWidth={isFullWidth}
    >
      {isLoading && <ButtonSpinner aria-hidden="true" />}
      {children}
    </StyledButton>
  )
}

export type { BaseButtonSize, BaseButtonVariant }
