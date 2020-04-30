import router from './router'
import { progress } from '@/plugins/processbar'
import getPageTitle from '@/utils/get-page-title'
import { rest } from '../api/rest'
router.beforeEach(async (to, from, next) => {
  progress.start()
  if (to.meta.isPublic) {
    next()
  } else {
    const { ok } = await rest('Master').get('check_logged')
    if (ok) {
      next()
    } else {
      next('/login')
    }
  }
})

router.afterEach((to, from) => {
  document.title = getPageTitle(to?.meta.title)
  progress.finish()
})
