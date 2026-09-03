import styled, { css } from 'styled-components'

import { microLabel } from '@/styles'

export type BaseTextVariant =
  'display' | 'title' | 'subtitle' | 'body' | 'label' | 'micro' | 'data'

export type BaseTextTone =
  'default' | 'muted' | 'faint' | 'accent' | 'danger' | 'onDark'

interface StyledTextProps {
  $variant: BaseTextVariant
  $tone: BaseTextTone
  $align?: 'left' | 'center' | 'right'
}

const variantStyles = {
  display: css`
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: ${({ theme }) => theme.fontSizes.display};
    font-weight: 300;
    line-height: 1.06;
    letter-spacing: -0.02em;
  `,
  title: css`
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: ${({ theme }) => theme.fontSizes.xl};
    font-weight: 400;
    line-height: 1.2;
    letter-spacing: -0.01em;
  `,
  subtitle: css`
    font-size: ${({ theme }) => theme.fontSizes.lg};
    font-weight: 600;
    line-height: 1.35;
    letter-spacing: -0.01em;
  `,
  body: css`
    font-size: ${({ theme }) => theme.fontSizes.md};
    line-height: 1.65;
  `,
  label: css`
    ${microLabel};
    font-size: ${({ theme }) => theme.fontSizes.xs};
    letter-spacing: 0.08em;
  `,
  micro: css`
    ${microLabel};
  `,
  data: css`
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    font-variant-numeric: tabular-nums;
  `,
} as const satisfies Record<BaseTextVariant, ReturnType<typeof css>>

const toneStyles = {
  default: css`
    color: ${({ theme }) => theme.colors.text};
  `,
  muted: css`
    color: ${({ theme }) => theme.colors.textMuted};
  `,
  faint: css`
    color: ${({ theme }) => theme.colors.textFaint};
  `,
  accent: css`
    color: ${({ theme }) => theme.colors.accent};
  `,
  danger: css`
    color: ${({ theme }) => theme.colors.danger};
  `,
  onDark: css`
    color: ${({ theme }) => theme.colors.onDark};
  `,
} as const satisfies Record<BaseTextTone, ReturnType<typeof css>>

export const StyledText = styled.span<StyledTextProps>`
  display: block;
  margin: 0;
  text-align: ${({ $align }) => $align ?? 'inherit'};

  ${({ $variant }) => variantStyles[$variant]};
  ${({ $tone }) => toneStyles[$tone]};
`
