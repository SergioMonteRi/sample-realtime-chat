import styled from 'styled-components'

import { focusRing, truncate } from '@/styles'

export const ContactButton = styled.button<{ $isActive: boolean }>`
  ${focusRing};

  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.radii.md};
  text-align: left;
  transition: background-color ${({ theme }) => theme.transitions.fast};

  background-color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.surface : 'transparent'};
  box-shadow: ${({ theme, $isActive }) =>
    $isActive ? theme.shadows.subtle : 'none'};

  &:hover {
    background-color: ${({ theme, $isActive }) =>
      $isActive ? theme.colors.surface : theme.colors.surfaceMuted};
  }
`

export const ContactCopy = styled.span`
  display: flex;
  flex-direction: column;
  min-width: 0;
`

export const ContactName = styled.span`
  ${truncate};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 600;
  letter-spacing: -0.005em;
  color: ${({ theme }) => theme.colors.text};
`

export const ContactEmail = styled.span`
  ${truncate};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textFaint};
`
