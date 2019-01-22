import Login from './login/index.js'
import Home from './home/index.js'
const components = [
  Login,
  Home
]
const install = function (Vue, opts = []) {
  components.map(component => Vue.use(component))
}

const routes = function () {
  return [].concat.apply([], components.map(component => component.routes !== undefined ? component.routes() : []))
}
export default {
  install,
  routes
}
