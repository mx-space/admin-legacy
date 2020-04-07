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

const createMessage = (message: string, options: MessageOptions) => {
  if (!message) {
    throw new Error('message is empty.')
  }
  const {
    type = 'info',
    color = '',
    closable = false,
    timeout = 3000,
  } = options
  const vNode = new MessageConstructor({
    data: { message: message, type, timeout, color, closable },
  })
  const dom = vNode.$mount()
  const listDom = document.getElementById('notice-list')
  listDom?.appendChild(dom.$el)
}

export interface MessageConstructor {
  (message: string | string[], options?: MessageOptions): void
}
export interface MessageOptions {
  timeout?: number
  type?: keyof typeof MessageType
  color?: string
  closable?: boolean
}
export interface Message {
  (message: string): void
  (message: string, options: MessageOptions): void
  success: MessageConstructor
  error: MessageConstructor
  info: MessageConstructor
  warning: MessageConstructor
}
export const Message: Message =
  (((message: string, options: MessageOptions = {}) => {
    // const { type, timeout } = options
    createMessage(message, options)
  }) as
    any) as
  Message
;['success', 'info', 'error', 'warning'].forEach((type) => {
  ;(Message as any)[type] = (
    message: string | string[],
    options?: MessageOptions,
  ) => {
    if (Array.isArray(message)) {
      message.forEach((message, index) => {
        setTimeout(() => {
          createMessage(
            message as string,
            ({ ...options, type } as any) as MessageOptions,
          )
        }, index * 100)
      })
    } else {
      createMessage(
        message as string,
        ({ ...options, type } as any) as MessageOptions,
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

