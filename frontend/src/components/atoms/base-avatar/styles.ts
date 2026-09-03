import type { DefaultTheme } from 'styled-components'
import styled, { css } from 'styled-components'

export type BaseAvatarSize = 'sm' | 'md' | 'lg'

interface AvatarProps {
  $size: BaseAvatarSize
  $seedHash: number
}

const sizeStyles = {
  sm: css`
    width: 2rem;
    height: 2rem;
    font-size: ${({ theme }) => theme.fontSizes.micro};
  `,
  md: css`
    width: 2.5rem;
    height: 2.5rem;
    font-size: ${({ theme }) => theme.fontSizes.xs};
  `,
  lg: css`
    width: 3rem;
    height: 3rem;
    font-size: ${({ theme }) => theme.fontSizes.sm};
  `,
} as const satisfies Record<BaseAvatarSize, ReturnType<typeof css>>

const getTone = (theme: DefaultTheme, seedHash: number) =>
  theme.avatarTones[seedHash % theme.avatarTones.length] ?? theme.avatarTones[0]

export const AvatarCircle = styled.span<AvatarProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 50%;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-weight: 700;
  letter-spacing: 0.04em;
  user-select: none;

  background-color: ${({ theme, $seedHash }) =>
    getTone(theme, $seedHash).background};
  color: ${({ theme, $seedHash }) => getTone(theme, $seedHash).foreground};

  ${({ $size }) => sizeStyles[$size]};
`
