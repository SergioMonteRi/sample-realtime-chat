import { apiClient } from '@/services/http'

import { authMessageResponseSchema } from './auth.schemas'
import type {
  AuthMessageResponse,
  LoginRequest,
  RegisterRequest,
} from './auth.types'

const AUTH_ENDPOINTS = {
  register: '/auth/register',
  login: '/auth/login',
  logout: '/auth/logout',
} as const

export const authService = {
  register: async (payload: RegisterRequest): Promise<AuthMessageResponse> => {
    const { data } = await apiClient.post(AUTH_ENDPOINTS.register, payload)

    return authMessageResponseSchema.parse(data)
  },

  /** O sucesso chega como cookie de sessao; o corpo traz so a confirmacao. */
  login: async (payload: LoginRequest): Promise<AuthMessageResponse> => {
    const { data } = await apiClient.post(AUTH_ENDPOINTS.login, payload)

    return authMessageResponseSchema.parse(data)
  },

  logout: async (): Promise<AuthMessageResponse> => {
    const { data } = await apiClient.post(AUTH_ENDPOINTS.logout)

    return authMessageResponseSchema.parse(data)
  },
}
