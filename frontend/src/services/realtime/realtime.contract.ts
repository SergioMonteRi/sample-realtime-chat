import type { ChatMessage } from '../messages'

/**
 * Contrato do canal em tempo real do backend (`backend/sockets/chat_socket.py`).
 *
 * As strings ficam aqui para que hooks e UI nunca as repitam soltas, e para
 * que ligar o Socket.IO seja trocar uma implementacao — nao cacar literais
 * espalhados pelo codigo.
 */
export const CHAT_REALTIME_EVENTS = {
  joinChat: 'join-chat',
  newMessage: 'new-message',
} as const

export type ChatRealtimeEvent =
  (typeof CHAT_REALTIME_EVENTS)[keyof typeof CHAT_REALTIME_EVENTS]

export type RealtimeListener = (message: ChatMessage) => void

/** Funcao devolvida por `on*`: chamar remove o listener. */
export type Unsubscribe = () => void

/**
 * A fronteira que a aplicacao enxerga do canal. Nenhum outro arquivo deve
 * conhecer `socket.io-client` — quem depender disto continua funcionando
 * com qualquer transporte por tras.
 */
export interface RealtimeGateway {
  connect(): void
  disconnect(): void
  isConnected(): boolean
  joinChat(chatId: string): void
  onNewMessage(listener: RealtimeListener): Unsubscribe
}
