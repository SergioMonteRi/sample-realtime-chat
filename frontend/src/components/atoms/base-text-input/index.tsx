import type { InputHTMLAttributes, ReactNode, Ref } from 'react'
import { useId } from 'react'

import {
  FieldLabel,
  FieldMessage,
  FieldWrapper,
  InputLeading,
  InputShell,
  StyledInput,
} from './styles'

type BaseTextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  /** Esconde o rotulo visualmente sem tira-lo dos leitores de tela. */
  hint?: string
  errorMessage?: string
  /** Slot livre a esquerda do campo — normalmente um `BaseIcon`. */
  leading?: ReactNode
  ref?: Ref<HTMLInputElement>
}

export function BaseTextInput({
  label,
  hint,
  errorMessage,
  leading,
  id,
  ref,
  ...inputProps
}: BaseTextInputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const messageId = `${inputId}-message`

  const hasError = Boolean(errorMessage)
  const message = errorMessage ?? hint

  return (
    <FieldWrapper>
      {label && <FieldLabel htmlFor={inputId}>{label}</FieldLabel>}

      <InputShell $hasError={hasError}>
        {leading && <InputLeading aria-hidden="true">{leading}</InputLeading>}

        <StyledInput
          {...inputProps}
          id={inputId}
          ref={ref}
          aria-invalid={hasError}
          aria-describedby={message ? messageId : undefined}
        />
      </InputShell>

      {message && (
        <FieldMessage
          id={messageId}
          $hasError={hasError}
          role={hasError ? 'alert' : undefined}
        >
          {message}
        </FieldMessage>
      )}
    </FieldWrapper>
  )
}
