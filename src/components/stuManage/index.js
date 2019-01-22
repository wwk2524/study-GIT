import Stulist from './stuList.vue'
import StuDetial from './stuDetial.vue'
import Qrcode from './qrcode.vue'

var components = [
  Stulist,
  StuDetial,
  Qrcode
]

/* istanbul ignore next */
const install = function (Vue, opts) {
  components.map(c => {
    Vue.component(c.name, c)
  })
}

const routes = function () {
  return [
    { path: '/stumanage/list', name: 'Stulist', component: Stulist },
    { path: '/stumanage/detial/:id', name: 'StuDetial', component: StuDetial },
    { path: '/qrcode', name: 'Qrcode', component: Qrcode }
  ]
}

export default { install, routes }
