import { z } from 'zod'

import { APP } from '@/constants'

/** Mesmo minimo exigido pelo `CreateUserRequest` do backend. */
export const registerSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, { error: 'validation.emailRequired' })
      .pipe(z.email({ error: 'validation.emailInvalid' })),
    password: z
      .string()
      .min(APP.passwordMinLength, { error: 'validation.passwordMin' }),
    confirmPassword: z
      .string()
      .min(1, { error: 'validation.passwordRequired' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: 'validation.confirmPasswordMismatch',
    path: ['confirmPassword'],
  })

export type RegisterFormData = z.infer<typeof registerSchema>
