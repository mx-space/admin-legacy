import { getToken } from '@/utils/auth'
import { Notification } from 'element-ui'
import io from 'socket.io-client'
import { configs } from '../configs'
import { $events } from '../main'
import { EventTypes } from './types'
import { Notice } from '../utils/notice'
import router from '../router'

export class SocketClient {
  public socket: SocketIOClient.Socket
  #title = configs.title
  #notice = new Notice()
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
    switch (type) {
      case EventTypes.GATEWAY_CONNECT: {
        Notification.success(data)
        break
      }
      case EventTypes.GATEWAY_DISCONNECT: {
        Notification.warning(data)
        break
      }
      case EventTypes.COMMENT_CREATE: {
        const body = data.author + ': ' + data.text
        const notice = Notification.success({
          title: '新的评论',
          message: body,
          onClick: () => {
            router.push({ name: 'comment' })
            notice.close()
          },
        })
        // TODO
        this.#notice.notice(this.#title + ' 收到新的评论', body)
        break
      }
    }

    $events.$emit(type, data)
  }
}
