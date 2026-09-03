import { keyframes } from 'styled-components'

export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

export const riseIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

/** Entrada do balao: sobe pouco, sem estardalhaco, e assenta. */
export const bubbleIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(6px) scale(0.99);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`

/** Batimento discreto de um indicador em espera. */
export const softPulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
`

export const spin = keyframes`
  to { transform: rotate(360deg); }
`
