import type { RealtimeGateway, Unsubscribe } from './realtime.contract'

/**
 * Implementacao inerte do canal: nao conecta e nunca entrega nada.
 *
 * E o valor inicial de `gateway`, entao qualquer codigo que rode antes de o
 * bootstrap instalar o Socket.IO (ver `providers/app-providers`) encontra
 * metodos que existem e nao fazem nada, em vez de esbarrar em `undefined`.
 * Tambem e o que se instala num teste que nao quer um socket de verdade.
 */
const nullRealtimeGateway: RealtimeGateway = {
  connect: () => {},
  disconnect: () => {},
  isConnected: () => false,
  joinChat: () => {},
  onNewMessage: (): Unsubscribe => () => {},
}

let gateway: RealtimeGateway = nullRealtimeGateway

/** Troca a implementacao do canal. Chamar uma vez, no bootstrap. */
export const setRealtimeGateway = (nextGateway: RealtimeGateway): void => {
  gateway = nextGateway
}

export const getRealtimeGateway = (): RealtimeGateway => gateway
