export const APP = {
  defaultLocale: 'pt-BR',
  httpTimeoutMs: 15000,

  /** O backend guarda o conteudo em `Text` e exige ao menos 1 caractere. */
  messageMinLength: 1,
  messageMaxLength: 2000,

  /** Minimo aceito pelo `CreateUserRequest` do backend. */
  passwordMinLength: 8,

  /**
   * O par de participantes de um chat nunca muda, entao o id resolvido pelo
   * `POST /chat` vale para a sessao inteira.
   */
  chatResolutionStaleTimeMs: Infinity,

  /**
   * O historico em cache nunca envelhece sozinho: enquanto nao ha canal em
   * tempo real, so o botao de atualizar (um `refetch`, que ignora este
   * valor) traz mensagem nova. A carga inicial continua acontecendo quando
   * a conversa ainda nao esta em cache. Ver `services/realtime`.
   */
  messagesStaleTimeMs: Infinity,
} as const
