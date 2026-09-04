import { z } from 'zod'

/** `POST /chat` devolve apenas o identificador da conversa. */
export const createChatResponseSchema = z
  .object({ chat_id: z.string() })
  .transform((response) => ({ chatId: response.chat_id }))

/**
 * O participante que `GET /chats` devolve e sempre o outro lado da conversa:
 * o backend descarta o proprio usuario ao montar a resposta, entao aqui nao
 * ha nada a filtrar.
 */
export const chatParticipantSchema = z.object({
  id: z.string(),
  email: z.email(),
})

const chatApiSchema = z.object({
  id: z.string(),
  participant: chatParticipantSchema,
  created_at: z.string(),
})

export const chatSchema = chatApiSchema.transform((chat) => ({
  id: chat.id,
  participant: chat.participant,
  createdAt: chat.created_at,
}))

export const getChatsResponseSchema = z.object({
  chats: z.array(chatSchema),
})
