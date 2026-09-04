import type { z } from 'zod'

import type {
  chatParticipantSchema,
  chatSchema,
  createChatResponseSchema,
  getChatsResponseSchema,
} from './chat.schemas'

export type CreateChatResponse = z.infer<typeof createChatResponseSchema>

/**
 * O outro lado da conversa — o unico participante que a API devolve. Um
 * `User` cabe aqui, o que deixa a mesma linha da barra lateral servir tanto
 * para uma conversa quanto para um contato novo.
 */
export type ChatParticipant = z.infer<typeof chatParticipantSchema>

export type Chat = z.infer<typeof chatSchema>

export type GetChatsResponse = z.infer<typeof getChatsResponseSchema>

export interface CreateChatRequest {
  receiverId: string
}
