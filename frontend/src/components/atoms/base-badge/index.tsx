import type { BaseBadgeTone } from './styles'
import { BadgeChip, BadgeDot } from './styles'

type BaseBadgeProps = {
  label: string
  tone?: BaseBadgeTone
  hasDot?: boolean
  className?: string
}

export function BaseBadge({
  label,
  tone = 'neutral',
  hasDot = false,
  className,
}: BaseBadgeProps) {
  return (
    <BadgeChip className={className} $tone={tone}>
      {hasDot && <BadgeDot aria-hidden="true" />}
      {label}
    </BadgeChip>
  )
}

export type { BaseBadgeTone }
