/**
 * Direcao visual: "papel e tinta".
 *
 * Fundo de papel quente, superficies brancas separadas por hairlines de 1px
 * em vez de sombras, e cor reservada para significado: tinta escura para a
 * propria voz do usuario, azul para acao e navegacao, vermelho para erro.
 * A conversa e o unico bloco com movimento — o resto da tela fica quieto.
 */
export const theme = {
  colors: {
    canvas: '#F6F5F1',
    surface: '#FFFFFF',
    surfaceMuted: '#F0EEE8',
    border: '#E5E2DA',
    borderStrong: '#D2CEC3',

    text: '#1B1A17',
    textMuted: '#6B6A61',
    textFaint: '#9C998F',
    onDark: '#FAF9F6',

    /** Tinta: botao primario e balao da propria mensagem. */
    ink: '#1B1A17',
    inkHover: '#33322B',

    accent: '#2C5A87',
    accentSoft: '#E8EFF6',
    accentStrong: '#1E4265',

    pending: '#95681B',
    pendingSoft: '#FAF1DF',

    danger: '#A93529',
    dangerSoft: '#F9EBE8',
  },

  fonts: {
    display: "'Newsreader', 'Iowan Old Style', Georgia, serif",
    sans: "'Plus Jakarta Sans', -apple-system, 'Segoe UI', Helvetica, sans-serif",
    mono: "'IBM Plex Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace",
  },

  fontSizes: {
    micro: '0.6875rem',
    xs: '0.75rem',
    sm: '0.8125rem',
    md: '0.875rem',
    lg: '1rem',
    xl: '1.375rem',
    display: 'clamp(2rem, 4.5vw, 2.75rem)',
    hero: 'clamp(4rem, 13vw, 7rem)',
  },

  spacing: {
    xxs: '0.25rem',
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3.5rem',
  },

  radii: {
    sm: '6px',
    md: '10px',
    lg: '16px',
    pill: '999px',
  },

  shadows: {
    subtle: '0 1px 2px rgba(27, 26, 23, 0.04)',
    card: '0 1px 2px rgba(27, 26, 23, 0.04), 0 16px 36px -24px rgba(27, 26, 23, 0.22)',
    lifted: '0 24px 56px -32px rgba(27, 26, 23, 0.3)',
  },

  layout: {
    /** Largura do cartao de autenticacao. */
    cardWidth: '25rem',
    /** Coluna de contatos da area de conversas. */
    sidebarWidth: '20rem',
    /** Largura maxima de um balao de mensagem. */
    bubbleMaxWidth: '32rem',
    workspaceMaxWidth: '78rem',
    headerHeight: '3.75rem',
  },

  transitions: {
    fast: '140ms cubic-bezier(0.3, 0, 0.2, 1)',
    base: '240ms cubic-bezier(0.3, 0, 0.2, 1)',
    spring: '420ms cubic-bezier(0.22, 1, 0.36, 1)',
  },

  /**
   * Paleta dos avatares. Cada contato recebe um tom estavel derivado do
   * proprio id (`base-avatar.utils.ts`), o que ajuda a reconhecer quem e
   * quem na lista sem depender de foto — que o backend nao guarda.
   */
  avatarTones: [
    { background: '#E8EFF6', foreground: '#1E4265' },
    { background: '#ECEFE6', foreground: '#47582F' },
    { background: '#F6EAE3', foreground: '#7A452E' },
    { background: '#EFE9F3', foreground: '#543E62' },
    { background: '#E5F0EB', foreground: '#22503F' },
    { background: '#F4EDDC', foreground: '#6B531B' },
  ],

  breakpoints: {
    /** Abaixo disto a area de conversas vira uma coluna so. */
    workspace: '54rem',
  },
} as const

export type AppTheme = typeof theme
