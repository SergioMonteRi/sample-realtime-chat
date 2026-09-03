import styled, { css } from 'styled-components'

import { microLabel } from '@/styles'

export type BaseBadgeTone = 'neutral' | 'accent' | 'pending' | 'danger'

const toneStyles = {
  neutral: css`
    color: ${({ theme }) => theme.colors.textMuted};
    background-color: ${({ theme }) => theme.colors.surfaceMuted};
    border-color: ${({ theme }) => theme.colors.border};
  `,
  accent: css`
    color: ${({ theme }) => theme.colors.accentStrong};
    background-color: ${({ theme }) => theme.colors.accentSoft};
    border-color: transparent;
  `,
  pending: css`
    color: ${({ theme }) => theme.colors.pending};
    background-color: ${({ theme }) => theme.colors.pendingSoft};
    border-color: transparent;
  `,
  danger: css`
    color: ${({ theme }) => theme.colors.danger};
    background-color: ${({ theme }) => theme.colors.dangerSoft};
    border-color: transparent;
  `,
} as const satisfies Record<BaseBadgeTone, ReturnType<typeof css>>

export const BadgeChip = styled.span<{ $tone: BaseBadgeTone }>`
  ${microLabel};

  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `0.3rem ${theme.spacing.sm}`};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radii.pill};
  letter-spacing: 0.08em;
  white-space: nowrap;

  ${({ $tone }) => toneStyles[$tone]};
`

export const BadgeDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: currentColor;
  flex-shrink: 0;
`
