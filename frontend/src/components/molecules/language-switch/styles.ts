import styled, { css } from 'styled-components'

import { focusRing, microLabel } from '@/styles'

export const SwitchWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 2px;
  gap: 2px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background-color: ${({ theme }) => theme.colors.surfaceMuted};
`

export const SwitchOption = styled.button<{ $isActive: boolean }>`
  ${microLabel};
  ${focusRing};

  padding: ${({ theme }) => `0.3rem ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.radii.pill};
  letter-spacing: 0.08em;
  transition:
    background-color ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};

  ${({ $isActive, theme }) =>
    $isActive
      ? css`
          background-color: ${theme.colors.surface};
          color: ${theme.colors.text};
          box-shadow: ${theme.shadows.subtle};
        `
      : css`
          color: ${theme.colors.textFaint};

          &:hover {
            color: ${theme.colors.textMuted};
          }
        `}
`
