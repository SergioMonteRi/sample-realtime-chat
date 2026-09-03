export const STORAGE_KEYS = {
  /**
   * Quem autentica de fato e o cookie de sessao do flask-login, que e
   * httpOnly e invisivel para o JavaScript. Isto aqui guarda apenas a
   * identidade exibida na interface — o backend continua sendo a fonte
   * de verdade, e um 401 limpa esta chave.
   */
  session: '@sala:session',
} as const
