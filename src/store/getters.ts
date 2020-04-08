import { GetterTree } from 'vuex'

const getters: GetterTree<any, any> = {
  sidebar: (state) => state.app.sidebar,
  menus: (state) => state.app.menus,
  title: (state) => state.app.title,
  device: (state) => {
    const viewport = state.app.viewport
    return !viewport.mobile ? 'desktop' : 'mobile'
  },
  viewport: (state) => state.app.viewport,
  token: (state) => state.user.token,
  avatar: (state) => state.user.avatar,
  name: (state) => state.user.name,
  username: (state) => state.user.username,
  profile: (state) => state.user,
}
export default getters
