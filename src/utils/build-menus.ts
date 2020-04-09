/* eslint-disable @typescript-eslint/no-use-before-define */
import { RouteConfig } from 'vue-router'

export interface MenuModel {
  title: string
  path: string
  icon: string | string[]
  subItems?: Array<MenuModel>
  hasParent: boolean
  fullPath: string
}

const model = (
  item: RouteConfig,
  hasParent: boolean,
  prevPath: string,
): MenuModel => {
  const fullPath = prevPath + '/' + item.path
  return {
    title: item.meta?.title || item.name || item.path,
    path: item.path && /^\//.test(item.path) ? item.path : '/' + item.path,
    icon: item.meta?.icon,
    subItems: buildSubMenus(item, fullPath),
    hasParent,
    fullPath,
  }
}
function buildSubMenus(route: RouteConfig, prevPath = '') {
  if (Array.isArray(route.children)) {
    return route.children.map((item) => {
      return model(item, true, prevPath)
    })
  }
}

const buildMenus = (routes: Array<RouteConfig>) =>
  (
    routes.find((item) => item.name === 'home' && item.path === '/') as any
  ).children
    .filter((item: RouteConfig) => item.path !== '*')
    .map((item: RouteConfig) => {
      return model(item, false, '')
    })

export default buildMenus
