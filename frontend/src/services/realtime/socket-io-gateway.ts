import { io, type Socket } from 'socket.io-client'

import { ENV } from '@/config'

import { messageSchema, toSentMessage } from '../messages'
import type { RealtimeGateway, Unsubscribe } from './realtime.contract'

const socket: Socket = io(ENV.socketUrl, {
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
    socket.emit('join-chat', {
      chat_id: chatId,
    })
  },

  onNewMessage(listener): Unsubscribe {
    const handleNewMessage = (payload: unknown) => {
      const message = messageSchema.safeParse(payload)

      if (!message.success) {
        console.error('Invalid paylod received by Socket.IO', message.error)
        return
      }

      listener(toSentMessage(message.data))
    }

    socket.on('new-message', handleNewMessage)

    return () => {
      socket.off('new-message', handleNewMessage)
    }
  },
}
