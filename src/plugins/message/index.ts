import Vue from 'vue'
import { VueConstructor } from 'vue/types/umd'
import Main from './message.vue'

const MessageConstructor = Vue.extend(Main)

export enum MessageType {
  'success',
  'info',
  'error',
  'warning',
}

const createMessage = (
  message: string,
  type: keyof typeof MessageType = 'info',
  timeout = 3000,
) => {
  if (!message) {
    throw new Error('message is empty.')
  }
  const vNode = new MessageConstructor({
    data: { message: message, type, timeout },
  })
  const dom = vNode.$mount()
  const listDom = document.getElementById('notice-list')
  listDom?.appendChild(dom.$el)
}

export const Message:
  | Record<keyof typeof MessageType | any, any>
  | Function
  | any = (
  message: string,
  options: { type?: keyof typeof MessageType; timeout?: number } = {},
) => {
  const { type, timeout } = options
  createMessage(message, type, timeout)
}
;['success', 'info', 'error', 'warning'].forEach((type) => {
  Message[type] = (message: string | string[], timeout: number) => {
    if (Array.isArray(message)) {
      message.forEach((message) => {
        createMessage(
          message as string,
          type as keyof typeof MessageType,
          timeout,
        )
      })
    } else {
      createMessage(
        message as string,
        type as keyof typeof MessageType,
        timeout,
      )
    }
  }
})

export default {
  install(Vue: VueConstructor, options = {}) {
    const messageListNode = document.createElement('div')
    messageListNode.setAttribute('id', 'notice-list')
    document.body.appendChild(messageListNode)
    messageListNode.style.cssText = `top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    padding: 1em;
    position: fixed;
    user-select: none;
    pointer-events: none;`
    Vue.prototype.$message = Message
  },
  Message,
}
