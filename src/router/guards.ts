import router from './router'
import { progress } from '@/plugins/processbar'
import getPageTitle from '@/utils/get-page-title'
router.beforeEach((to, from, next) => {
  progress.start()
  next()
})

router.afterEach((to, from) => {
  document.title = getPageTitle(to?.meta.title)
  progress.finish()
})
