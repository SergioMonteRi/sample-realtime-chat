import type { BaseIconName } from './base-icon.paths'
import { ICON_PATHS } from './base-icon.paths'
import { StyledSvg } from './styles'

type BaseIconProps = {
  name: BaseIconName
  size?: number
  strokeWidth?: number
  /** Quando ausente, o icone e decorativo e sai da arvore de acessibilidade. */
  title?: string
  className?: string
}

export function BaseIcon({
  name,
  size = 18,
  strokeWidth = 1.6,
  title,
  className,
}: BaseIconProps) {
  return (
    <StyledSvg
      className={className}
      $size={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}

      {ICON_PATHS[name].map((path) => (
        <path key={path} d={path} />
      ))}
    </StyledSvg>
  )
}

export type { BaseIconName }
