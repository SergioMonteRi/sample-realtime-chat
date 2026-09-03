import { z } from 'zod'

import { APP, ONLY_WHITESPACE_REGEX } from '@/constants'

/** Mesmos limites do backend: `content` e obrigatorio e nao pode ser so espaco. */
export const messageComposerSchema = z.object({
  content: z
    .string()
    .min(APP.messageMinLength, { error: 'validation.messageRequired' })
    .max(APP.messageMaxLength, { error: 'validation.messageMax' })
    .refine((content) => !ONLY_WHITESPACE_REGEX.test(content), {
      error: 'validation.messageRequired',
    }),
})

export type MessageComposerFormData = z.infer<typeof messageComposerSchema>
