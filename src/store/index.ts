import { AppModule } from '@/store/modules/app'
import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import { UserModule } from './modules/user'
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
