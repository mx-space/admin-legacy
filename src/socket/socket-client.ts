import io from 'socket.io-client'
import { getToken } from '@/utils/auth'
export class SocketClient {
  public socket: SocketIOClient.Socket

  constructor() {
    this.socket = io(
      /* process.env.VUE_APP_GATEWAY || */ 'http://localhost:2333?token=' +
        getToken(),
      {
        timeout: 3000,
        reconnectionDelay: 3000,
        reconnectionAttempts: 5,
        autoConnect: false,
      },
    )

    this.socket.open()
    this.socket.on('message', console.log)
  }
}
