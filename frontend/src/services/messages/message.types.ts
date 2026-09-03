import type { z } from 'zod'

import type {
  createMessageResponseSchema,
  getMessagesResponseSchema,
  messageSchema,
} from './message.schemas'

/** Entidade como o backend a devolve, derivada do schema. */
export type Message = z.infer<typeof messageSchema>

export type GetMessagesResponse = z.infer<typeof getMessagesResponseSchema>
export type CreateMessageResponse = z.infer<typeof createMessageResponseSchema>

/**
 * `sending` so existe no cliente: e a mensagem otimista, ainda sem
 * confirmacao do servidor.
 */
export type MessageDeliveryStatus = 'sent' | 'sending'

/** O que a conversa realmente renderiza. */
export interface ChatMessage extends Message {
  deliveryStatus: MessageDeliveryStatus
}

export interface SendMessageRequest {
  content: string
}
