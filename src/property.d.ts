// 1. Make sure to import 'vue' before declaring augmented types
import { rest } from '@/api/rest'
import { Message } from '@/plugins/message'
import QProgress from 'qier-progress'
// 2. Specify a file with the types you want to augment
//    Vue has the constructor type in types/vue.d.ts
declare module 'vue/types/vue' {
  // 3. Declare augmentation for Vue
  interface Vue {
    $process: QProgress
    $notice: Message
    $api: typeof rest
  }
}
