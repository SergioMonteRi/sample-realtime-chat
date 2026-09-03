import type { ElementType, ReactNode } from 'react'

import type { BaseTextTone, BaseTextVariant } from './styles'
import { StyledText } from './styles'

type BaseTextProps = {
  children: ReactNode
  as?: ElementType
  variant?: BaseTextVariant
  tone?: BaseTextTone
  align?: 'left' | 'center' | 'right'
  id?: string
  className?: string
}

export function BaseText({
  children,
  as = 'p',
  variant = 'body',
  tone = 'default',
  align,
  id,
  className,
}: BaseTextProps) {
  return (
    <StyledText
      as={as}
      id={id}
      className={className}
      $variant={variant}
      $tone={tone}
      $align={align}
    >
      {children}
    </StyledText>
  )
}

export type { BaseTextTone, BaseTextVariant }
