import type { z } from 'zod'

import type { authMessageResponseSchema, sessionSchema } from './auth.schemas'

export type AuthMessageResponse = z.infer<typeof authMessageResponseSchema>

export type Session = z.infer<typeof sessionSchema>

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
}
