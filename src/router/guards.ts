import router from './router'
import { progress } from '@/plugins/processbar'
import getPageTitle from '@/utils/get-page-title'
import { rest } from '../api/rest'
router.beforeEach(async (to, _, next) => {
  progress.start()
  if (to.meta.isPublic) {
    next()
  } else {
    const { ok } = (await rest('Master').get('check_logged')) as any
    if (ok) {
      next()
    } else {
      next('/login')
    }
  }
})

router.afterEach((to, _) => {
  document.title = getPageTitle(to?.meta.title)
  progress.finish()
})
