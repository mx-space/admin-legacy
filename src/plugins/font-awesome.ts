import Vue from 'vue'
import {
  library,
  IconDefinition,
  IconPack,
} from '@fortawesome/fontawesome-svg-core'
import { faKey, faUser } from '@fortawesome/free-solid-svg-icons'
import {} from '@fortawesome/free-regular-svg-icons'
import {} from '@fortawesome/free-brands-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
type IconType = IconDefinition | IconPack
export const Icons: IconType[] = [faUser, faKey]

library.add(...Icons)

Vue.component('icon', FontAwesomeIcon)
