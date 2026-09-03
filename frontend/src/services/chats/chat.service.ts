import { apiClient } from '@/services/http'

import { createChatResponseSchema } from './chat.schemas'
import type { CreateChatRequest, CreateChatResponse } from './chat.types'

const CHAT_ENDPOINT = '/chat'

export const chatService = {
  /**
   * Idempotente por contrato: o `ChatService.create_chat` do backend procura
   * uma conversa que ja tenha os dois participantes antes de criar outra.
   * Chamar de novo para o mesmo par devolve sempre o mesmo `chat_id`.
   */
  createChat: async ({
    receiverId,
  }: CreateChatRequest): Promise<CreateChatResponse> => {
    const { data } = await apiClient.post(CHAT_ENDPOINT, {
      receiver_id: receiverId,
    })

    return createChatResponseSchema.parse(data)
  },
}
