import type { ChatMessage, Message } from './message.types'

/**
 * Remetente das mensagens ainda nao confirmadas.
 *
 * O backend nao expoe o usuario autenticado (nao ha `GET /auth/me`), entao a
 * propria identidade so aparece no `sender_id` que volta do `POST`. Ate la,
 * este marcador garante que a mensagem otimista caia do lado certo — a regra
 * de lado e `isOutgoingMessage`, logo abaixo.
 */
export const OUTGOING_SENDER_ID = '@me'

const OPTIMISTIC_ID_PREFIX = 'optimistic:'

/**
 * De que lado da conversa a mensagem fica.
 *
 * Um chat aqui tem exatamente dois participantes (`ChatParticipant`), entao
 * "nao foi o contato quem mandou" equivale a "fui eu" — sem precisar do id
 * do usuario autenticado, que o backend nao informa.
 */
export const isOutgoingMessage = (message: Message, peerId: string): boolean =>
  message.senderId !== peerId

export const isOptimisticMessage = (message: ChatMessage): boolean =>
  message.id.startsWith(OPTIMISTIC_ID_PREFIX)

/** Marca uma mensagem vinda do servidor como confirmada. */
export const toSentMessage = (message: Message): ChatMessage => ({
  ...message,
  deliveryStatus: 'sent',
})

interface CreateOptimisticMessageParams {
  chatId: string
  content: string
}

export const createOptimisticMessage = ({
  chatId,
  content,
}: CreateOptimisticMessageParams): ChatMessage => ({
  id: `${OPTIMISTIC_ID_PREFIX}${crypto.randomUUID()}`,
  chatId,
  senderId: OUTGOING_SENDER_ID,
  content,
  createdAt: new Date().toISOString(),
  deliveryStatus: 'sending',
})
