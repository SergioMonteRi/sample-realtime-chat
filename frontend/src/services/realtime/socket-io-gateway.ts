import { io, type Socket } from 'socket.io-client'

import { ENV } from '@/config'

import { messageSchema, toSentMessage } from '../messages'
import type { RealtimeGateway, Unsubscribe } from './realtime.contract'
import { CHAT_REALTIME_EVENTS } from './realtime.contract'

/**
 * O handshake precisa levar o cookie de sessao do flask-login: e por ele que
 * o backend sabe quem esta entrando na sala (ver `sockets/chat_socket.py`).
 * `autoConnect: false` deixa a conexao para o bootstrap, depois de o
 * gateway estar instalado.
 */
const socket: Socket = io(ENV.socketUrl, {
  path: ENV.socketPath,
  withCredentials: true,
  autoConnect: false,
})

socket.on('connect', () => {
  console.log('Socket conectado!')
  console.log('Socket ID:', socket.id)
})

socket.on('connect_error', (error) => {
  console.error('Erro ao conectar no Socket.IO:', error)
})

socket.on('disconnect', (reason) => {
  console.log('Socket desconectado:', reason)
})

export const socketIoGateway: RealtimeGateway = {
  connect() {
    socket.connect()
  },

  disconnect() {
    socket.disconnect()
  },

  isConnected() {
    return socket.connected
  },

  joinChat(chatId: string) {
    socket.emit(CHAT_REALTIME_EVENTS.joinChat, {
      chat_id: chatId,
    })
  },

  onNewMessage(listener): Unsubscribe {
    const handleNewMessage = (payload: unknown) => {
      const message = messageSchema.safeParse(payload)

      if (!message.success) {
        console.error('Invalid payload received by Socket.IO', message.error)
        return
      }

      listener(toSentMessage(message.data))
    }

    socket.on(CHAT_REALTIME_EVENTS.newMessage, handleNewMessage)

    return () => {
      socket.off(CHAT_REALTIME_EVENTS.newMessage, handleNewMessage)
    }
  },
}
