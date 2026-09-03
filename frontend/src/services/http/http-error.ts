import axios from 'axios'
import { ZodError } from 'zod'

export type ApiErrorKind =
  | 'network'
  | 'unauthorized'
  | 'forbidden'
  | 'not-found'
  | 'validation'
  | 'conflict'
  | 'contract'
  | 'unexpected'

export interface NormalizedApiError {
  kind: ApiErrorKind
  status: number | null
  /** Mensagem tecnica: serve para log, nunca para exibir ao usuario. */
  message: string
}

/** O Flask responde `{ "error": "..." }` em toda falha tratada. */
const getBackendErrorMessage = (data: unknown): string | null => {
  if (typeof data !== 'object' || data === null) return null

  const { error } = data as { error?: unknown }

  return typeof error === 'string' ? error : null
}

/**
 * Traduz qualquer erro em um formato estavel para a camada de hooks.
 * Nenhum detalhe tecnico daqui deve chegar a tela.
 */
export const normalizeApiError = (error: unknown): NormalizedApiError => {
  /* O schema rejeitou a resposta: o backend mudou de formato. */
  if (error instanceof ZodError) {
    return { kind: 'contract', status: null, message: error.message }
  }

  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? null
    const message =
      getBackendErrorMessage(error.response?.data) ?? error.message

    if (!error.response) {
      return { kind: 'network', status, message }
    }

    if (status === 401) return { kind: 'unauthorized', status, message }
    if (status === 403) return { kind: 'forbidden', status, message }
    if (status === 404) return { kind: 'not-found', status, message }
    if (status === 409) return { kind: 'conflict', status, message }
    if (status === 400 || status === 422) {
      return { kind: 'validation', status, message }
    }

    return { kind: 'unexpected', status, message }
  }

  if (error instanceof Error) {
    return { kind: 'unexpected', status: null, message: error.message }
  }

  return { kind: 'unexpected', status: null, message: String(error) }
}

export const getApiErrorKind = (error: unknown): ApiErrorKind =>
  normalizeApiError(error).kind

export const isUnauthorizedError = (error: unknown): boolean =>
  getApiErrorKind(error) === 'unauthorized'

export const isValidationError = (error: unknown): boolean =>
  getApiErrorKind(error) === 'validation'
