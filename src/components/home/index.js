import Home from './home.vue'

import Welcome from '../welcome'
import StuManage from '../stuManage'
import RightManage from '../rightManage'
import wwkVue from '../wwkVue'
import wzy from '../wzy'
import signUpManage from '../signUpManage'

const homeComponent = [
  Home
]
const homeChildCompents = [
  Welcome, StuManage,RightManage,wwkVue,wzy,signUpManage
]

const install = function (Vue, opts) {
  homeComponent.map(c => {
    Vue.component(c.name, c)
  })
  homeChildCompents.map(c => Vue.use(c))
}
const homeChildRoutes = function () {
  var childs = [].concat.apply([{
    path: '',
    name: 'Home',
    component: Home
  }], homeChildCompents.map(component => component.routes !== undefined ? component.routes() : []))
  return childs
}

const routes = function () {
  return [{
    path: '/home',
    // name: 'Home',
    component: Home,
    children: homeChildRoutes()
  }]
}
export default {
  install,
  routes
}
