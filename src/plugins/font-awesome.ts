import {
  IconDefinition,
  IconPack,
  library,
} from '@fortawesome/fontawesome-svg-core'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import {} from '@fortawesome/free-regular-svg-icons'
import {
  faKey,
  faUser,
  faGlobe,
  faSignOutAlt,
  faSlidersH,
  faTachometerAlt,
  faGlobeAsia,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Vue from 'vue'

type IconType = IconDefinition | IconPack
export const Icons: IconType[] = [
  faUser,
  faKey,
  faGithub,
  faGlobe,
  faSignOutAlt,
  faSlidersH,
  faTachometerAlt,
  faGlobeAsia,
]

library.add(...Icons)

Vue.component('icon', FontAwesomeIcon)
