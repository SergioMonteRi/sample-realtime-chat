import { v4 as uuidv4 } from 'uuid'

import type { ChatMessage, Message } from './message.types'

const OPTIMISTIC_ID_PREFIX = 'optimistic:'

/**
 * De que lado da conversa a mensagem fica: comparacao direta com o id de
 * quem esta logado, que vem de `GET /me` (`services/users`).
 *
 * A regra nao depende de a conversa ter dois participantes — le o remetente
 * de verdade, e nao "quem nao e o contato".
 */
export const isOutgoingMessage = (
  message: Message,
  currentUserId: string,
): boolean => message.senderId === currentUserId

export const isOptimisticMessage = (message: ChatMessage): boolean =>
  message.id.startsWith(OPTIMISTIC_ID_PREFIX)

/** Marca uma mensagem vinda do servidor como confirmada. */
export const toSentMessage = (message: Message): ChatMessage => ({
  ...message,
  deliveryStatus: 'sent',
})

interface CreateOptimisticMessageParams {
  chatId: string
  senderId: string
  content: string
}

/**
 * O balao ja nasce com o `senderId` real, entao cai do lado certo sem
 * nenhum marcador. O `id`, esse sim, continua sendo do cliente: o
 * definitivo so existe depois do commit, e e por ele que a mensagem
 * confirmada substitui este balao.
 */
export const createOptimisticMessage = ({
  chatId,
  senderId,
  content,
}: CreateOptimisticMessageParams): ChatMessage => ({
  id: `${OPTIMISTIC_ID_PREFIX}${uuidv4()}`,
  chatId,
  senderId,
  content,
  createdAt: new Date().toISOString(),
  deliveryStatus: 'sending',
})
