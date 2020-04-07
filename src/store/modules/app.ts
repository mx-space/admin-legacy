import Cookies from 'js-cookie'
import { configs } from '@/configs'
import { VuexModule, Mutation, Action, Module } from 'vuex-module-decorators'
import { ViewportRecord } from '@/store/interfaces/viewport.interface'

@Module({ namespaced: true })
export class AppModule extends VuexModule {
  sidebar: boolean = Cookies.get('sidebarStatus') === '0' ? false : true
  menus: Array<any> = []
  title = configs.title || 'MX-Space'
  viewport: ViewportRecord | any = null

  @Mutation
  SET_SIDEBAR(status: boolean) {
    this.sidebar = status
  }

  @Mutation
  SET_MENUS(menus: Array<Record<string, any>>) {
    this.menus = [...menus]
  }

  @Mutation
  SET_VIEWPORT(viewport: ViewportRecord) {
    this.viewport = { ...viewport }
  }

  @Action({ commit: 'SET_SIDEBAR', rawError: true })
  setSidebarStatus(status: boolean) {
    Cookies.set('sidebarStatus', String(Number(status)))
    return status
  }

  @Action({ commit: 'SET_SIDEBAR', rawError: true })
  toggleSidebarStatus() {
    const toggle = !this.sidebar

    Cookies.set('sidebarStatus', String(Number(toggle)))
    return toggle
  }

  @Action({ commit: 'SET_VIEWPORT', rawError: true })
  updateViewport(): ViewportRecord {
    return {
      w: document.documentElement.getBoundingClientRect().width,
      h: window.innerHeight,
      mobile: window.screen.width <= 568 || window.innerWidth <= 568,
      pad: window.innerWidth <= 768 && window.innerWidth > 568,
      hpad: window.innerWidth <= 1024 && window.innerWidth > 768,
      wider: window.innerWidth > 1024 && window.innerWidth < 1920,
      widest: window.innerWidth >= 1920,
    }
  }
  @Action({ commit: 'SET_MENUS', rawError: true })
  initMenus(menus: Array<any>) {
    return menus
  }
}
