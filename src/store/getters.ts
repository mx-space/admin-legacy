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
  count: (state) => state.user.count,
  profile: (state) => {
    const user = Object.assign({}, state.user)
    delete user.token
    return user
  },
  category: (state) => state.category.category,
}
export default getters
