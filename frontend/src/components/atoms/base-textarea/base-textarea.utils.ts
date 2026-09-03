const FALLBACK_LINE_HEIGHT = 20

/**
 * Ajusta a altura do campo ao conteudo, ate o limite de linhas. Fica fora do
 * componente para poder ser chamada tambem quando o formulario e limpo por
 * codigo — nesse caso o navegador nao dispara `input`.
 */
export const resizeTextarea = (
  element: HTMLTextAreaElement | null,
  maxRows: number,
): void => {
  if (!element) return

  const styles = window.getComputedStyle(element)

  const lineHeight =
    Number.parseFloat(styles.lineHeight) || FALLBACK_LINE_HEIGHT
  const verticalPadding =
    Number.parseFloat(styles.paddingTop) +
    Number.parseFloat(styles.paddingBottom)

  const maxHeight = lineHeight * maxRows + verticalPadding

  /* `auto` primeiro: sem isso o scrollHeight nunca diminui. */
  element.style.height = 'auto'
  element.style.height = `${Math.min(element.scrollHeight, maxHeight)}px`
  element.style.overflowY = element.scrollHeight > maxHeight ? 'auto' : 'hidden'
}
