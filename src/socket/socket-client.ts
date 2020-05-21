import io from 'socket.io-client'
import { getToken } from '@/utils/auth'
import { EventTypes } from './types'
import { $events } from '../main'

export class SocketClient {
  public socket: SocketIOClient.Socket

  constructor() {
    this.socket = io(
      (process.env.VUE_APP_GATEWAY || 'http://localhost:2333') +
        '?token=' +
        getToken(),
      {
        timeout: 3000,
        reconnectionDelay: 3000,
        reconnectionAttempts: 5,
        autoConnect: false,
      },
    )

    this.socket.open()
    this.socket.on(
      'message',
      (payload: string | Record<'type' | 'data', any>) => {
        if (typeof payload !== 'string') {
          return this.handleEvent(payload.type, payload.data)
        }
        const { data, type } = JSON.parse(payload) as {
          data: any
          type: EventTypes
        }
        this.handleEvent(type, data)
      },
    )
  }

  handleEvent(type: EventTypes, data: any) {
    $events.$emit(type, data)
  }
}
