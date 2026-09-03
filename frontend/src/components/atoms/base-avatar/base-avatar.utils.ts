/**
 * Hash estavel de uma semente (o id do contato). O mesmo contato recebe
 * sempre o mesmo tom, em qualquer sessao e em qualquer maquina.
 */
export const getSeedHash = (seed: string): number => {
  let hash = 0

  for (const character of seed) {
    hash = (hash * 31 + character.charCodeAt(0)) % 1_000_003
  }

  return hash
}
