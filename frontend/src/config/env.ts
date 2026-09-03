type AppEnv = 'development' | 'staging' | 'production'

/** Caminho que o Flask-SocketIO expoe por padrao para o Engine.IO. */
const DEFAULT_SOCKET_PATH = '/socket.io'

export const ENV = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  /**
   * Reservado para a fase de tempo real. Vazio cai para a mesma origem do
   * front, util atras de um proxy reverso em producao.
   */
  socketUrl: import.meta.env.VITE_SOCKET_URL || undefined,
  socketPath: import.meta.env.VITE_SOCKET_PATH || DEFAULT_SOCKET_PATH,
  appEnv: import.meta.env.VITE_APP_ENV as AppEnv,
  isDevelopment: import.meta.env.VITE_APP_ENV === 'development',
} as const
