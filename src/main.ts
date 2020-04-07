import Vue, { VueConstructor } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'normalize.css/normalize.css'
import { PerfectScrollbar } from 'vue2-perfect-scrollbar'
Vue.component('ps', PerfectScrollbar as VueConstructor<Vue>)

import './plugins/font-awesome'
import './plugins/vuetify'
import './plugins/element-ui'
import './plugins/processbar'
import { rest } from '@/api/rest'
Vue.prototype.$api = rest
import Message from './plugins/message'
Vue.use(Message)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
