import styled from 'styled-components'

export const ComposerWrapper = styled.div`
  flex-shrink: 0;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg} ${theme.spacing.md}`};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.canvas};

  @media (max-width: ${({ theme }) => theme.breakpoints.workspace}) {
    padding-inline: ${({ theme }) => theme.spacing.md};
  }
`

export const ComposerForm = styled.form`
  display: flex;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `${theme.spacing.xxs} ${theme.spacing.xxs} ${theme.spacing.xxs} ${theme.spacing.md}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background-color: ${({ theme }) => theme.colors.surface};
  transition:
    border-color ${({ theme }) => theme.transitions.fast},
    box-shadow ${({ theme }) => theme.transitions.fast};

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accentSoft};
  }
`

export const ComposerActions = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 2px;
`

export const ComposerHint = styled.p`
  margin: ${({ theme }) => `${theme.spacing.xxs} 0 0`};
  padding-left: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textFaint};
`
