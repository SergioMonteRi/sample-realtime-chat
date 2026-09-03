/**
 * Acesso tipado ao localStorage. Nunca lanca: em modo privativo ou com
 * storage bloqueado o app continua funcionando so com o estado em memoria.
 */
export const localStorageUtils = {
  get<T>(key: string): T | null {
    try {
      const raw = window.localStorage.getItem(key)

      return raw ? (JSON.parse(raw) as T) : null
    } catch {
      return null
    }
  },

  set<T>(key: string, value: T): void {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* storage indisponivel: seguimos apenas com o estado em memoria */
    }
  },

  remove(key: string): void {
    try {
      window.localStorage.removeItem(key)
    } catch {
      /* storage indisponivel: nada a limpar */
    }
  },
}
