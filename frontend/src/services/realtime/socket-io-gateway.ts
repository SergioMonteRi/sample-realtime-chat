import { io, type Socket } from 'socket.io-client'

import { ENV } from '@/config'

import { messageSchema, toSentMessage } from '../messages'
import type { RealtimeGateway, Unsubscribe } from './realtime.contract'
import { CHAT_REALTIME_EVENTS } from './realtime.contract'

const socket: Socket = io(ENV.socketUrl, {
  path: ENV.socketPath,
  withCredentials: true,
  autoConnect: false,
})

socket.on('connect', () => {
  console.log('Socket ID:', socket.id)
})

socket.on('connect_error', (error) => {
  console.error('Error to connet on Socket.IO:', error)
})

socket.on('disconnect', (reason) => {
  console.log('Socket desconnected:', reason)
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
