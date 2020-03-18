import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import Vueaxios from 'vue-axios'
import store from './store'
import utils from './utils'

// 引入 vue-loading-overlay
import { Icon } from 'leaflet'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'

Vue.component('Loading', Loading)

Vue.config.productionTip = false
Vue.use(Vueaxios, axios)

import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

// 按需引入 fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// fas
import {
  faClinicMedical,
  faMapMarkerAlt,
  faPhoneAlt,
  faAngleLeft
} from '@fortawesome/free-solid-svg-icons'
// far
import { far } from '@fortawesome/free-regular-svg-icons'
// fab
import { fab } from '@fortawesome/free-brands-svg-icons'

library.add(faClinicMedical, faMapMarkerAlt, faPhoneAlt, faAngleLeft, far, fab)
// 可自定義font-awesome-icon -> fa
Vue.component('fa', FontAwesomeIcon)

// 全域使用 utils
Vue.prototype.$utils = utils

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
