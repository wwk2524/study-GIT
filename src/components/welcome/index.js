import Welcome from './welcome.vue'

const components = [
  Welcome
]
const install = function (Vue, opts) {
  components.map(c => {
    Vue.component(c.name, c)
  })
}
const routes = function () {
  return [
    { path: '/Welcome', name: 'Welcome', component: Welcome }
  ]
}

export default { install, routes }