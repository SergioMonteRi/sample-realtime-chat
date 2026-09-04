import { z } from 'zod'

/**
 * Importado do arquivo, e nao do barril `../messages`: aquele arrasta
 * `message.mutations`, que por sua vez importa deste dominio — e o ciclo
 * fecharia. `message.schemas` nao depende de nada nosso.
 */
import { messageSchema } from '../messages/message.schemas'

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
  /**
   * Nulo enquanto a conversa nao tem mensagem. Nao e caso hipotetico: a
   * conversa nasce num `POST /chat` seguido de `POST /messages`, e se a
   * segunda chamada falhar sobra exatamente uma conversa vazia.
   */
  last_message_at: z.string().nullable(),
  last_message: messageSchema.nullable(),
})

export const chatSchema = chatApiSchema.transform((chat) => ({
  id: chat.id,
  participant: chat.participant,
  createdAt: chat.created_at,
  lastMessageAt: chat.last_message_at,
  lastMessage: chat.last_message,
}))

export const getChatsResponseSchema = z.object({
  chats: z.array(chatSchema),
})
