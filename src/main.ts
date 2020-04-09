import Vue, { VueConstructor } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'normalize.css/normalize.css'
import '@/assets/fonts/stylesheet.css'
import { PerfectScrollbar } from 'vue2-perfect-scrollbar'
Vue.component('ps', PerfectScrollbar as VueConstructor<Vue>)

import './plugins/font-awesome'
import './plugins/vuetify'
import './plugins/element-ui'
import './plugins/processbar'
import './plugins/kico-message'
import { rest } from '@/api/rest'
import 'vue-tsx-support/enable-check'
Vue.prototype.$api = rest

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
