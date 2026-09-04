export const APP = {
  defaultLocale: 'pt-BR',
  httpTimeoutMs: 15000,

  /** O backend guarda o conteudo em `Text` e exige ao menos 1 caractere. */
  messageMinLength: 1,
  messageMaxLength: 2000,

  /** Minimo aceito pelo `CreateUserRequest` do backend. */
  passwordMinLength: 8,

  /**
   * O historico em cache nunca envelhece sozinho porque nao precisa: quem
   * traz mensagem nova e o canal, que escreve direto na query (ver
   * `services/messages/message.cache.ts`). Sobram a carga inicial, quando a
   * conversa ainda nao esta em cache, e o botao de atualizar — um `refetch`,
   * que ignora este valor.
   */
  messagesStaleTimeMs: Infinity,
} as const
