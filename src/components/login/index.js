import Login from './login.vue'
import Register from './register.vue'
const components = [
  Login,
  Register
]
const install = function (Vue, opts) {
  components.map(c => {
    Vue.component(c.name, c)
  })
}
const routes = function () {
  return [{
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'defaultLogin',
      component: Login
    },
    {
      path:'/reg',
      name:'register',
      component:Register
    }
  ]
}
export default {
  install,
  routes
}
