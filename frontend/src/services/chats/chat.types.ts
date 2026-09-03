import type { z } from 'zod'

import type { createChatResponseSchema } from './chat.schemas'

export type CreateChatResponse = z.infer<typeof createChatResponseSchema>

export interface CreateChatRequest {
  receiverId: string
}
