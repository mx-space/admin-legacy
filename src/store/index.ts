import Vue from 'vue'
import Vuex from 'vuex'
import { UserModule } from './modules/user'
import getters from './getters'
import { AppModule } from '@/store/modules/app'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    user: UserModule,
    app: AppModule,
  },
  getters,
})
