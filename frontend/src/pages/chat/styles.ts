import styled from 'styled-components'

export const ChatLayout = styled.div`
  display: grid;
  grid-template-columns: ${({ theme }) => theme.layout.sidebarWidth} minmax(
      0,
      1fr
    );
  /* Uma linha, limitada a altura disponivel: uma linha "auto" deixaria o
     conteudo esticar a grade e o recorte escaparia para a pagina. */
  grid-template-rows: minmax(0, 1fr);
  flex: 1;
  min-height: 0;
  width: 100%;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.workspace}) {
    grid-template-columns: minmax(0, 1fr);
  }
`

/**
 * Em telas estreitas nao cabem as duas colunas: quem manda e a rota. Com
 * uma conversa aberta, a lista sai de cena; sem conversa, ela ocupa tudo.
 */
export const SidebarSlot = styled.div<{ $isHiddenOnNarrow: boolean }>`
  display: flex;
  min-height: 0;
  border-right: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: ${({ theme }) => theme.breakpoints.workspace}) {
    display: ${({ $isHiddenOnNarrow }) => ($isHiddenOnNarrow ? 'none' : 'flex')};
    border-right: none;
  }
`

export const ConversationSlot = styled.div<{ $isHiddenOnNarrow: boolean }>`
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.workspace}) {
    display: ${({ $isHiddenOnNarrow }) => ($isHiddenOnNarrow ? 'none' : 'flex')};
  }
`

export const ConversationPlaceholder = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  min-height: 0;
`
