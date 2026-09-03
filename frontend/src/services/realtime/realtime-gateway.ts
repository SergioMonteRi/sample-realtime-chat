import type { RealtimeGateway, Unsubscribe } from './realtime.contract'

/**
 * Implementacao inerte do canal — esta fase do projeto e so REST.
 *
 * Ela existe para que a integracao do Socket.IO seja aditiva: nada na UI
 * muda, porque nada na UI fala com o socket direto.
 *
 * Para ligar o canal, em tres passos:
 *
 * 1. `npm install socket.io-client` e criar `socket-io-gateway.ts` que
 *    implemente `RealtimeGateway` com `io(ENV.socketUrl, { path: ENV.socketPath,
 *    withCredentials: true })` — a sala e a do evento `join-chat`.
 * 2. Chamar `setRealtimeGateway(socketIoGateway)` uma vez no bootstrap
 *    (`providers/app-providers`), junto do QueryClient.
 * 3. Em um hook novo (`services/messages/use-chat-realtime.ts`), assinar
 *    `onNewMessage`, validar o payload com `messageSchema` e entregar o
 *    resultado a `applyIncomingMessage(queryClient, toSentMessage(message))`.
 *    A partir dai a mensagem entra na mesma `queryKey` que a tela ja observa
 *    e a origem do dado fica invisivel para os componentes.
 *
 * O backend tambem precisa passar a emitir `new-message` na sala
 * `chat:<chat_id>` depois do `MessageService.create_message`.
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
