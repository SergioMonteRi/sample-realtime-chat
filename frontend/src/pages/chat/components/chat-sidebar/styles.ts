import styled from 'styled-components'

import { microLabel, quietScrollbar } from '@/styles'

export const SidebarWrapper = styled.aside`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  background-color: ${({ theme }) => theme.colors.canvas};
`

export const SidebarHeader = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.md}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

export const SidebarTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  min-height: 2rem;
`

/* Ocupa a sobra para empurrar a contagem e o botao para a direita. */
export const SidebarTitle = styled.h2`
  ${microLabel};
  flex: 1;
  min-width: 0;
  color: ${({ theme }) => theme.colors.textMuted};
`

export const SidebarCount = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textFaint};
`

export const ContactList = styled.ul`
  ${quietScrollbar};

  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-height: 0;
  margin: 0;
  padding: ${({ theme }) => theme.spacing.xs};
  overflow-y: auto;
  list-style: none;
`

export const SidebarStatus = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
`
