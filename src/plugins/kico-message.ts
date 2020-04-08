import Message, { Message as M } from 'kico-message'
import Vue from 'vue'
Vue.use(Message)
Vue.prototype.$notice = M
