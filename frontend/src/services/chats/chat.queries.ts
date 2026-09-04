import { queryOptions } from '@tanstack/react-query'

import { isUnauthorizedError } from '@/services/http'

import { chatService } from './chat.service'

export const chatKeys = {
  all: ['chats'] as const,
  list: () => [...chatKeys.all, 'list'] as const,
}

export const chatQueries = {
  /**
   * As conversas do usuario logado.
   *
   * Esta lista e a fonte do `chat_id`, e e o que torna a abertura de uma
   * conversa uma leitura pura: antes de existir `GET /chats`, o front
   * resolvia o id com um `POST /chat` a cada vez que a tela abria — o que
   * criava uma conversa vazia so por alguem ter clicado num nome.
   */
  list: () =>
    queryOptions({
      queryKey: chatKeys.list(),
      queryFn: chatService.getChats,
      /* Sessao recusada nao melhora com nova tentativa: quem trata e o AuthProvider. */
      retry: (failureCount, error) =>
        !isUnauthorizedError(error) && failureCount < 2,
      meta: { errorMessageKey: 'chat:errors.chatsFailed' },
    }),
}
