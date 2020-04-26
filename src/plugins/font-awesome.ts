import {
  IconDefinition,
  IconPack,
  library,
} from '@fortawesome/fontawesome-svg-core'
import { faGithub, faTelegramPlane } from '@fortawesome/free-brands-svg-icons'
import {
  faCheckCircle,
  faComments,
  faFile,
  faSave,
  faTrashAlt,
} from '@fortawesome/free-regular-svg-icons'
import {
  faAngleDoubleRight,
  faBook,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faComment,
  faEye,
  faFlask,
  faGlobe,
  faGlobeAsia,
  faKey,
  faPencilAlt,
  faPlus,
  faSignOutAlt,
  faSlidersH,
  faTachometerAlt,
  faTimes,
  faUser,
  faCode,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Vue from 'vue'

type IconType = IconDefinition | IconPack
export const Icons: IconType[] = [
  faUser,
  faComment,
  faKey,
  faFile,
  faCode,
  faSave,
  faGithub,
  faGlobe,
  faCheckCircle,
  faTrashAlt,
  faTimes,
  faSignOutAlt,
  faAngleDoubleRight,
  faFlask,
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
  faComments,
]

library.add(...Icons)

Vue.component('icon', FontAwesomeIcon)
