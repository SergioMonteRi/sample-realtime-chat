/**
 * Traçados dos icones em uma grade de 24x24, desenhados so com stroke para
 * herdarem `currentColor`. Ficam fora do JSX para que a UI continue legivel
 * e para que nenhum path seja duplicado entre telas.
 */
export const ICON_PATHS = {
  send: ['m4.5 19.5 15-7.5-15-7.5 2.2 7.5-2.2 7.5Z', 'M6.7 12H19.5'],
  refresh: ['M20 12a8 8 0 1 1-2.4-5.7', 'M20 4.5V9h-4.5'],
  search: ['M11 4.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Z', 'm16 16 3.5 3.5'],
  signOut: [
    'M14.5 4.5H7A1.5 1.5 0 0 0 5.5 6v12A1.5 1.5 0 0 0 7 19.5h7.5',
    'M11.5 12H20',
    'm16.5 8.5 3.5 3.5-3.5 3.5',
  ],
  message: ['M4.5 5.5h15v11h-8.4L7 20v-3.5H4.5Z'],
  check: ['m5 12.5 4.5 4.5L19 7'],
  arrowLeft: ['M19.5 12H5', 'm10.5 6-5.5 6 5.5 6'],
  clock: ['M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Z', 'M12 7.5V12l3 1.8'],
  userPlus: [
    'M10 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z',
    'M3.5 19.5c0-3 2.9-4.8 6.5-4.8 1 0 2 .1 2.8.4',
    'M17.5 14v6',
    'M14.5 17h6',
  ],
} as const

export type BaseIconName = keyof typeof ICON_PATHS
