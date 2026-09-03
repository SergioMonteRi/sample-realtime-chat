export const ROUTES = {
  root: '/',
  login: '/entrar',
  register: '/cadastro',
  conversations: '/conversas',
  conversationWithUser: '/conversas/:userId',
  notFound: '*',
} as const

/**
 * A conversa e enderecada pelo id do contato, e nao pelo id do chat: o chat
 * so existe depois do `POST /chat`, enquanto o contato ja veio de `GET /users`.
 * Assim o link continua valido antes mesmo da primeira mensagem.
 */
export const buildConversationRoute = (userId: string): string =>
  ROUTES.conversationWithUser.replace(':userId', userId)
