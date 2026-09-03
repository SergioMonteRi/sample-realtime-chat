import type { ChangeEvent } from 'react'

import { BaseIcon, BaseTextInput } from '@/components/atoms'

import { SearchWrapper } from './styles'

type SearchFieldProps = {
  value: string
  label: string
  placeholder?: string
  onChange: (value: string) => void
}

export function SearchField({
  value,
  label,
  placeholder,
  onChange,
}: SearchFieldProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value)
  }

  return (
    <SearchWrapper>
      <BaseTextInput
        type="search"
        value={value}
        onChange={handleChange}
        aria-label={label}
        placeholder={placeholder}
        autoComplete="off"
        leading={<BaseIcon name="search" size={16} />}
      />
    </SearchWrapper>
  )
}
