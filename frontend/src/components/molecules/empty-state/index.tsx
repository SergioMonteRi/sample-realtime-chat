import type { ReactNode } from 'react'

import type { BaseIconName } from '@/components/atoms'
import { BaseIcon, BaseText } from '@/components/atoms'

import {
  EmptyActions,
  EmptyDescription,
  EmptyMark,
  EmptyWrapper,
} from './styles'

type EmptyStateProps = {
  title: string
  description?: string
  icon?: BaseIconName
  action?: ReactNode
}

export function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <EmptyWrapper>
      {icon && (
        <EmptyMark>
          <BaseIcon name={icon} size={20} />
        </EmptyMark>
      )}

      <BaseText as="h2" variant="subtitle">
        {title}
      </BaseText>

      {description && <EmptyDescription>{description}</EmptyDescription>}

      {action && <EmptyActions>{action}</EmptyActions>}
    </EmptyWrapper>
  )
}
