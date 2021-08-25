import Vue from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/pl'
dayjs.locale('pl')
Vue.prototype.$dayjs = dayjs;