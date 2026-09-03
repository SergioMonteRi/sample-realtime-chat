import { apiClient } from '@/services/http'

import {
  createMessageResponseSchema,
  getMessagesResponseSchema,
} from './message.schemas'
import type { Message, SendMessageRequest } from './message.types'

const buildMessagesEndpoint = (chatId: string): string =>
  `/chat/${chatId}/messages`

export const messageService = {
  /** O backend ja devolve ordenado por `created_at` ascendente. */
  getMessages: async (chatId: string): Promise<Message[]> => {
    const { data } = await apiClient.get(buildMessagesEndpoint(chatId))

    return getMessagesResponseSchema.parse(data).messages
  },

  createMessage: async (
    chatId: string,
    payload: SendMessageRequest,
  ): Promise<Message> => {
    const { data } = await apiClient.post(
      buildMessagesEndpoint(chatId),
      payload,
    )

    return createMessageResponseSchema.parse(data).message
  },
}
