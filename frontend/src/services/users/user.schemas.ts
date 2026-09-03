import { z } from 'zod'

/**
 * Contrato de `GET /users` validado na fronteira: o que entra na aplicacao
 * ja sai daqui em camelCase. Se o backend mudar de formato, o erro aparece
 * aqui — e nao como `undefined` tres camadas acima.
 */
const userApiSchema = z.object({
  id: z.string(),
  email: z.email(),
  created_at: z.string(),
})

export const userSchema = userApiSchema.transform((user) => ({
  id: user.id,
  email: user.email,
  createdAt: user.created_at,
}))

export const getUsersResponseSchema = z.object({
  users: z.array(userSchema),
})
