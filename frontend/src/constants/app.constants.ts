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
   * Historico so e revalidado sob demanda (foco da janela ou botao de
   * atualizar). Mensagens que chegam enquanto a tela esta aberta sao o
   * trabalho do canal em tempo real — ver `services/realtime`.
   */
  messagesStaleTimeMs: 10_000,
} as const
