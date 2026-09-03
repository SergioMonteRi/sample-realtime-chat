import { z } from 'zod'

/**
 * As mensagens sao chaves de traducao: quem renderiza decide o idioma, e o
 * schema segue sendo a unica fonte de verdade da validacao.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { error: 'validation.emailRequired' })
    .pipe(z.email({ error: 'validation.emailInvalid' })),
  password: z.string().min(1, { error: 'validation.passwordRequired' }),
})

export type LoginFormData = z.infer<typeof loginSchema>
