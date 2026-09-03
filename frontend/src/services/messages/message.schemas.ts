import { z } from 'zod'

/** Contrato do `MessageResponse` do backend, validado na fronteira. */
const messageApiSchema = z.object({
  id: z.string(),
  chat_id: z.string(),
  sender_id: z.string(),
  content: z.string(),
  created_at: z.string(),
})

export const messageSchema = messageApiSchema.transform((message) => ({
  id: message.id,
  chatId: message.chat_id,
  senderId: message.sender_id,
  content: message.content,
  createdAt: message.created_at,
}))

export const getMessagesResponseSchema = z.object({
  messages: z.array(messageSchema),
})

export const createMessageResponseSchema = z.object({
  message: messageSchema,
})
