import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/socket'
import 'normalize.css/normalize.css'
import '@/assets/fonts/stylesheet.css'
import PerfectScrollbar from 'vue2-perfect-scrollbar'
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'

Vue.use(PerfectScrollbar)

import './plugins/font-awesome'
import './plugins/element-ui'
import './plugins/processbar'
import './plugins/kico-message'
import { rest } from '@/api/rest'
import 'vue-tsx-support/enable-check'
import Component from 'vue-class-component'

export const $events = new Vue()

Vue.prototype.$api = rest
Vue.prototype.$events = $events
Vue.config.productionTip = false

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate',
])

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
