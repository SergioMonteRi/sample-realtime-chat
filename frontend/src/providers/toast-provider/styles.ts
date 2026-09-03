import { createGlobalStyle } from 'styled-components'

/** Sonner e headless aqui: a aparencia vem toda do tema. */
export const ToastStyles = createGlobalStyle`
  [data-sonner-toast] {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    width: 100%;
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radii.md};
    background-color: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text};
    box-shadow: ${({ theme }) => theme.shadows.lifted};
    font-family: ${({ theme }) => theme.fonts.sans};
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }

  [data-sonner-toast][data-type='error'] {
    border-left: 3px solid ${({ theme }) => theme.colors.danger};
  }

  [data-sonner-toast][data-type='success'] {
    border-left: 3px solid ${({ theme }) => theme.colors.accent};
  }

  [data-sonner-toast] [data-icon] {
    display: none;
  }
`
