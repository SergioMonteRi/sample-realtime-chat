import styled from 'styled-components'

import { fadeIn, microLabel, truncate } from '@/styles'

/**
 * A unica altura definida da arvore, e o que faz o resto funcionar: sem uma
 * caixa fechada aqui, o `flex: 1` + `overflow-y: auto` da lista de mensagens
 * resolve contra a altura do conteudo, nunca recorta, e quem rola passa a ser
 * a pagina inteira — levando cabecalho e barra lateral com ela.
 *
 * `dvh` e nao `vh` para acompanhar a barra de endereco no mobile. Sem
 * `flex: 1`: num item de flex column o `flex-basis` manda no tamanho
 * principal e o `height` seria ignorado.
 */
export const ShellWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100dvh;
  overflow: hidden;
`

export const ShellHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  flex-shrink: 0;
  width: 100%;
  height: ${({ theme }) => theme.layout.headerHeight};
  padding-inline: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.canvas};
  animation: ${fadeIn} 500ms ease both;

  @media (max-width: ${({ theme }) => theme.breakpoints.workspace}) {
    padding-inline: ${({ theme }) => theme.spacing.md};
  }
`

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const SessionBlock = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding-left: ${({ theme }) => theme.spacing.sm};
  border-left: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: ${({ theme }) => theme.breakpoints.workspace}) {
    border-left: none;
    padding-left: 0;
  }
`

export const SessionCopy = styled.span`
  display: flex;
  flex-direction: column;
  min-width: 0;
  max-width: 14rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.workspace}) {
    display: none;
  }
`

export const SessionLabel = styled.span`
  ${microLabel};
  font-size: 0.5625rem;
  color: ${({ theme }) => theme.colors.textFaint};
`

export const SessionEmail = styled.span`
  ${truncate};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`

export const SignOutLabel = styled.span`
  @media (max-width: ${({ theme }) => theme.breakpoints.workspace}) {
    display: none;
  }
`

export const ShellMain = styled.main`
  display: flex;
  flex: 1;
  min-height: 0;
  width: 100%;
`
