import axios from 'axios'

import { ENV } from '@/config'
import { APP } from '@/constants'

import { notifyUnauthorized } from './unauthorized-handler'

/** Prefixo cujas falhas 401 significam "credenciais invalidas", nao sessao expirada. */
const AUTH_ENDPOINT_PREFIX = '/auth/'

export const apiClient = axios.create({
  baseURL: ENV.apiBaseUrl,
  timeout: APP.httpTimeoutMs,
  headers: { 'Content-Type': 'application/json' },
  /**
   * O backend autentica por cookie de sessao (flask-login) e o front esta em
   * outra origem, entao sem esta flag o axios nao envia o cookie — e o
   * backend precisa responder com `supports_credentials=True` no flask-cors
   * para o navegador aceita-lo.
   */
  withCredentials: true,
})

/**
 * Um 401 fora das rotas de autenticacao quer dizer que o cookie de sessao
 * caiu. Em vez de cada tela tratar isso, o cliente avisa uma vez e quem
 * cuida da sessao decide o que fazer (ver `providers/auth-provider`).
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const requestUrl = error.config?.url ?? ''

      if (!requestUrl.startsWith(AUTH_ENDPOINT_PREFIX)) notifyUnauthorized()
    }

    return Promise.reject(error)
  },
)
