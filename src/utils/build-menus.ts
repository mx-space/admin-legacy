import { RouteConfig } from 'vue-router'

export interface MenuModel {
  title: string
  path: string
  icon: string | string[]
  subItems?: Array<MenuModel>
}

const model = (item: RouteConfig): MenuModel => ({
  title: item.meta?.title || item.name || item.path,
  path: item.path && /^\//.test(item.path) ? item.path : '/' + item.path,
  icon: item.meta?.icon,
  subItems: buildSubMenus(item),
})

function buildSubMenus(route: RouteConfig) {
  if (Array.isArray(route.children)) {
    return route.children.map((item) => {
      return model(item)
    })
  }
}

const buildMenus = (routes: Array<RouteConfig>) =>
  (
    routes.find((item) => item.name === 'home' && item.path === '/') as any
  ).children
    .filter((item: RouteConfig) => item.path !== '*')
    .map((item: RouteConfig) => {
      return model(item)
    })

export default buildMenus
