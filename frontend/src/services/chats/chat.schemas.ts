import { z } from 'zod'

/** `POST /chat` devolve apenas o identificador da conversa. */
export const createChatResponseSchema = z
  .object({ chat_id: z.string() })
  .transform((response) => ({ chatId: response.chat_id }))
