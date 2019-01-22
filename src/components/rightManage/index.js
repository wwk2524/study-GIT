import rightManage from './rightManage.vue'

var components = [
  rightManage
]

/* istanbul ignore next */
const install = function (Vue, opts) {
  components.map(c => {
    Vue.component(c.name, c)
  })
}

const routes = function () {
  return [{
    path: '/rightmanage/index',
    name: 'RightManage',
    component: rightManage
  }]
}

export default {
  install,
  routes
}
