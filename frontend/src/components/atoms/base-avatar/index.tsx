import { getInitials } from '@/utils'

import { getSeedHash } from './base-avatar.utils'
import type { BaseAvatarSize } from './styles'
import { AvatarCircle } from './styles'

type BaseAvatarProps = {
  /** Texto exibido em iniciais — normalmente o nome derivado do e-mail. */
  name: string
  /** Semente do tom. O id do contato mantem a cor estavel se o nome mudar. */
  seed?: string
  size?: BaseAvatarSize
  className?: string
}

export function BaseAvatar({
  name,
  seed,
  size = 'md',
  className,
}: BaseAvatarProps) {
  return (
    <AvatarCircle
      className={className}
      aria-hidden="true"
      $size={size}
      $seedHash={getSeedHash(seed ?? name)}
    >
      {getInitials(name)}
    </AvatarCircle>
  )
}

export type { BaseAvatarSize }
