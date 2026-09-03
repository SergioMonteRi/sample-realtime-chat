import { z } from 'zod'

/** `/auth/register`, `/auth/login` e `/auth/logout` respondem so com uma mensagem. */
export const authMessageResponseSchema = z.object({
  message: z.string(),
})

/**
 * Identidade da sessao guardada no cliente.
 *
 * O backend nao expoe o usuario autenticado (nao existe `GET /auth/me`) e o
 * cookie do flask-login e httpOnly, entao o unico dado de identidade que o
 * front conhece e o e-mail digitado no login. Ele serve para a interface; a
 * autorizacao continua inteiramente do lado do servidor.
 */
export const sessionSchema = z.object({
  email: z.email(),
})
