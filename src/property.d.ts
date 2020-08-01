// 1. Make sure to import 'vue' before declaring augmented types
import { rest } from '@/api/rest'
import { Message } from 'kico-message'
import QProgress from 'qier-progress'
import { EventTypes } from './socket/types'

// 2. Specify a file with the types you want to augment
//    Vue has the constructor type in types/vue.d.ts
declare module 'vue/types/vue' {
  // 3. Declare augmentation for Vue
  interface Vue {
    $process: QProgress
    $notice: Message
    $api: typeof rest

    $events: Omit<
      CombinedVueInstance<Vue, object, object, object, Record<never, any>>,
      '$on'
    > &
      (
        | { $on: (event: EventTypes, data: any) => void }
        | { $on: (event: string, ...payload: any[]) => void }
      )
  }
}
