import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
	faSearch, faStar, faUsers, faSortAlphaDown,
	faEdit, faCheck, faTimes, faImage,
	faPhone, faEnvelope,
	faAngleRight, faAngleLeft, faAngleDown, faAngleUp,
} from '@fortawesome/free-solid-svg-icons'
import { faFacebookMessenger } from '@fortawesome/free-brands-svg-icons'

library.add(
	faSearch, faStar, faUsers, faSortAlphaDown,
	faEdit, faCheck, faTimes, faImage,
	faAngleRight, faAngleLeft, faAngleDown, faAngleUp,
	faPhone, faEnvelope, faFacebookMessenger,
)

Vue.component('fa-icon', FontAwesomeIcon)