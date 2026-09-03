import type { z } from 'zod'

import type { getUsersResponseSchema, userSchema } from './user.schemas'

/** Entidade de dominio usada por toda a UI, derivada do schema. */
export type User = z.infer<typeof userSchema>

export type GetUsersResponse = z.infer<typeof getUsersResponseSchema>
