import { Message as M } from '@/plugins/message'

const Message = {
  // info: M.info,
  error: M.error,
  success: M.success,
  // warn: M.warn,
  // warning: M.warning,
}
class SocketClient {
  static retryDelay(times: number) {
    switch (times) {
      case 0: {
        return 500
      }
      case 1: {
        return 1000
      }
      case 2: {
        return 3000
      }
      case 3:
      case 4:
      case 5: {
        return 5000
      }
      default: {
        return 10000
      }
    }
  }

  static readonly CONNECTING = 0
  static readonly OPEN = 1
  static readonly CLOSING = 2
  static readonly CLOSED = 3
  static readonly RECONNECTING = 4

  public ws = new WebSocket(process.env.VUE_APP_GATEWAY)
  private _reconnectTimer: null | number = null
  private _retryCount = 0
  private _reconnecting = false

  constructor() {
    window.addEventListener('online', () => {
      this._onOnline()
    })
    window.addEventListener('offline', () => {
      this._onOffline()
    })
    this.ws.onopen = this._onOpen.bind(this)
    this.ws.onclose = this._onClose.bind(this)
    this.ws.onerror = this._onError.bind(this)
    this.ws.onmessage = this._onMessage.bind(this)
  }

  open(url = this.ws.url) {
    if (this.state !== SocketClient.CLOSED) {
      return
    }
    this._connect(url)
  }

  close(code: number, reason: string) {
    if (this.state !== SocketClient.CLOSED) {
      this._reconnecting = false
      this._close(code, reason)
    }
  }

  send(data: string | any) {
    if (this.state !== SocketClient.OPEN) {
      return
    }
    this.ws.send(JSON.stringify(data))
  }

  get url() {
    return this.ws && this.ws.url
  }

  get online() {
    return navigator.onLine
  }

  get state() {
    if (!this.ws) {
      return SocketClient.CLOSED
    }
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING: {
        return this._retryCount === 0
          ? SocketClient.CONNECTING
          : SocketClient.RECONNECTING
      }
      case WebSocket.OPEN: {
        return SocketClient.OPEN
      }
      case WebSocket.CLOSING: {
        return SocketClient.CLOSING
      }
      case WebSocket.CLOSED: {
        return SocketClient.CLOSED
      }
      default: {
        return SocketClient.CLOSED
      }
    }
  }
  _connect(url = this.url) {
    this.ws = new WebSocket(url)
    this.ws.onopen = this._onOpen.bind(this)
    this.ws.onclose = this._onClose.bind(this)
    this.ws.onerror = this._onError.bind(this)
    this.ws.onmessage = this._onMessage.bind(this)
  }
  _reconnect(url = this.url) {
    if (this._reconnectTimer) {
      clearTimeout(this._reconnectTimer)
    }
    this._reconnecting = true
    this._reconnectTimer = setTimeout(() => {
      this._retryCount += 1
      console.log(`[ws] reconnect ${this._retryCount} times`)
      if (this.online) {
        this._connect(url)
      }
    }, SocketClient.retryDelay(this._retryCount))
  }

  _close(code: number, reason: string) {
    this.ws.close(code, reason)
  }

  _stopReconnect() {
    if (this._reconnectTimer) {
      clearTimeout(this._reconnectTimer)
      this._reconnectTimer = 0
    }
  }

  _onOpen() {
    console.log(`[ws] open`)
    this._retryCount = 0
    this._reconnecting = false
    this._stopReconnect()
  }

  _onClose(event: { reason?: string; code: number }) {
    console.log(`[ws] close`)
    const { code } = event

    switch (code) {
      case 1006: {
        this._reconnect(this.url)
        break
      }
      default:
        break
    }
    console.log('close')
  }

  _onMessage(event: { data: any }) {
    // TODO onmessage
    // const { data } = event
    // // console.log(data);
    // try {
    //   const {
    //     type,
    //     message,
    //   }: { type: keyof typeof Message; message: string } = JSON.parse(data)
    //   Message[type]({
    //     message: 'Notice',
    //   })
    // } catch (err) {
    //   console.log(err)
    // }
  }

  _onError(event: any) {
    console.error(`[ws] error`)

    console.log(event)
  }

  _onOnline() {
    console.log(`[ws] online`)
    if (this._reconnecting && this.state !== SocketClient.OPEN) {
      this._connect(this.url)
    }
  }

  _onOffline() {
    console.log(`[ws] offline`)
    this._reconnecting = true
    this._stopReconnect()
  }
}

export default SocketClient
