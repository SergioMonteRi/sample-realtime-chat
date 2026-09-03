import type { ChangeEvent, Ref, TextareaHTMLAttributes } from 'react'
import { useId } from 'react'

import { resizeTextarea } from './base-textarea.utils'
import {
  FieldMessage,
  FieldWrapper,
  HiddenLabel,
  StyledTextarea,
} from './styles'

type BaseTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  /** Sempre obrigatorio: fica visivel apenas para leitores de tela. */
  label: string
  errorMessage?: string
  /** Ate quantas linhas o campo cresce antes de rolar. */
  maxRows?: number
  ref?: Ref<HTMLTextAreaElement>
}

export function BaseTextarea({
  label,
  errorMessage,
  maxRows = 6,
  id,
  ref,
  rows = 1,
  onChange,
  ...textareaProps
}: BaseTextareaProps) {
  const generatedId = useId()
  const textareaId = id ?? generatedId
  const messageId = `${textareaId}-message`

  const hasError = Boolean(errorMessage)

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    resizeTextarea(event.currentTarget, maxRows)
    onChange?.(event)
  }

  return (
    <FieldWrapper>
      <HiddenLabel htmlFor={textareaId}>{label}</HiddenLabel>

      <StyledTextarea
        {...textareaProps}
        id={textareaId}
        ref={ref}
        rows={rows}
        onChange={handleChange}
        $hasError={hasError}
        aria-invalid={hasError}
        aria-describedby={errorMessage ? messageId : undefined}
      />

      {errorMessage && (
        <FieldMessage id={messageId} role="alert">
          {errorMessage}
        </FieldMessage>
      )}
    </FieldWrapper>
  )
}
