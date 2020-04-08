import router from './router'
import { progress } from '@/plugins/processbar'
router.beforeEach((to, from, next) => {
  progress.start()
  next()
})

router.afterEach((to, from) => {
  progress.finish()
})
