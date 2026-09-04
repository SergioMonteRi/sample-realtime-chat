export const ROUTES = {
  root: '/',
  login: '/entrar',
  register: '/cadastro',
  conversations: '/conversas',
  conversationWithUser: '/conversas/:userId',
  notFound: '*',
} as const

/**
 * A conversa e enderecada pelo id do contato, e nao pelo id do chat.
 *
 * O chat so passa a existir no primeiro envio, entao enderecar por ele
 * deixaria sem URL justamente a conversa que ainda nao comecou. Pelo
 * contato, o link vale desde antes da primeira mensagem — e continua valendo
 * depois, porque `GET /chats` devolve o participante junto de cada conversa.
 */
export const buildConversationRoute = (userId: string): string =>
  ROUTES.conversationWithUser.replace(':userId', userId)
