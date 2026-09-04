import { z } from 'zod'

export const authMessageResponseSchema = z.object({
  message: z.string(),
})

export const sessionSchema = z.object({
  email: z.email(),
})
