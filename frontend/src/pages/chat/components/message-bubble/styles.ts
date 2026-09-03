import styled, { css } from 'styled-components'

import { bubbleIn } from '@/styles'

interface BubbleProps {
  $isOutgoing: boolean
}

export const BubbleRow = styled.div<
  BubbleProps & { $isSequenceStart: boolean }
>`
  display: flex;
  justify-content: ${({ $isOutgoing }) =>
    $isOutgoing ? 'flex-end' : 'flex-start'};
  margin-top: ${({ theme, $isSequenceStart }) =>
    $isSequenceStart ? theme.spacing.md : '2px'};
`

export const BubbleBody = styled.div<BubbleProps>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxs};
  max-width: min(${({ theme }) => theme.layout.bubbleMaxWidth}, 78%);
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.radii.lg};
  animation: ${bubbleIn} 260ms cubic-bezier(0.22, 1, 0.36, 1) both;

  ${({ $isOutgoing }) =>
    $isOutgoing
      ? css`
          background-color: ${({ theme }) => theme.colors.ink};
          color: ${({ theme }) => theme.colors.onDark};
          border-bottom-right-radius: ${({ theme }) => theme.radii.sm};
        `
      : css`
          background-color: ${({ theme }) => theme.colors.surface};
          color: ${({ theme }) => theme.colors.text};
          border: 1px solid ${({ theme }) => theme.colors.border};
          border-bottom-left-radius: ${({ theme }) => theme.radii.sm};
        `}
`

export const BubbleContent = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.md};
  line-height: 1.55;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`

export const BubbleMeta = styled.span<BubbleProps>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxs};
  align-self: flex-end;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.625rem;
  letter-spacing: 0.02em;
  opacity: ${({ $isOutgoing }) => ($isOutgoing ? 0.6 : 1)};
  color: ${({ theme, $isOutgoing }) =>
    $isOutgoing ? theme.colors.onDark : theme.colors.textFaint};
`
