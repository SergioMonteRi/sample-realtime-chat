type UnauthorizedHandler = () => void

let handler: UnauthorizedHandler | null = null

/**
 * Ponto unico de registro para o que fazer quando o backend recusa a
 * sessao. O service layer nao pode importar React nem o router, entao ele
 * apenas avisa — quem registra o handler e o `AuthProvider`.
 */
export const setUnauthorizedHandler = (
  nextHandler: UnauthorizedHandler | null,
): void => {
  handler = nextHandler
}

export const notifyUnauthorized = (): void => {
  handler?.()
}
