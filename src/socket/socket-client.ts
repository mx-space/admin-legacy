/*
 * @Author: Innei
 * @Date: 2020-05-21 17:01:09
 * @LastEditTime: 2020-05-31 19:32:10
 * @LastEditors: Innei
 * @FilePath: /mx-admin/src/socket/socket-client.ts
 * @MIT
 */

import { getToken } from '@/utils/auth'
import { Notification } from 'element-ui'
import io from 'socket.io-client'
import { configs } from '../configs'
import { $events } from '../main'
import router from '../router'
import { Notice } from '../utils/notice'
import { EventTypes } from './types'

export class SocketClient {
  public socket!: SocketIOClient.Socket

  #title = configs.title
  #notice = new Notice()
  constructor() {
    this.socket = io(
      (process.env.VUE_APP_GATEWAY || 'http://localhost:2333') + '/admin',
      {
        timeout: 10000,
        reconnectionDelay: 3000,
        autoConnect: false,
        query: {
          token: getToken(),
        },
      },
    )
    this.initIO()
  }
  initIO() {
    if (!this.socket) {
      return
    }
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
  reconnect() {
    this.socket.io.opts.query = {
      token: getToken(),
    }
    this.socket.open()
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
      case EventTypes.AUTH_FAILED: {
        console.log('等待登陆中...')
        this.socket.close()
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
