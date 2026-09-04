import { apiClient } from '@/services/http'

import {
  createChatResponseSchema,
  getChatsResponseSchema,
} from './chat.schemas'
import type { Chat, CreateChatRequest, CreateChatResponse } from './chat.types'

const CHAT_ENDPOINT = '/chat'
const CHATS_ENDPOINT = '/chats'

export const chatService = {
  /**
   * As conversas do usuario logado, cada uma com o outro participante
   * embutido — entao a barra lateral se monta com uma requisicao, sem
   * cruzar a lista de usuarios com nada.
   */
  getChats: async (): Promise<Chat[]> => {
    const { data } = await apiClient.get(CHATS_ENDPOINT)

    return getChatsResponseSchema.parse(data).chats
  },

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
