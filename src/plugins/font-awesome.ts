import {
  IconDefinition,
  IconPack,
  library,
} from '@fortawesome/fontawesome-svg-core'
import { faGithub, faTelegramPlane } from '@fortawesome/free-brands-svg-icons'
import { faSave } from '@fortawesome/free-regular-svg-icons'
import {
  faKey,
  faUser,
  faGlobe,
  faSignOutAlt,
  faSlidersH,
  faTachometerAlt,
  faGlobeAsia,
  faPencilAlt,
  faPlus,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faEye,
  faBook,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Vue from 'vue'

type IconType = IconDefinition | IconPack
export const Icons: IconType[] = [
  faUser,
  faKey,
  faSave,
  faGithub,
  faGlobe,
  faSignOutAlt,
  faSlidersH,
  faTachometerAlt,
  faGlobeAsia,
  faPencilAlt,
  faEye,
  faPlus,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faSlidersH,
  faTelegramPlane,
  faBook,
]

library.add(...Icons)

Vue.component('icon', FontAwesomeIcon)
