import Vue from 'vue'
import Router from 'vue-router'
import Element from 'element-ui'
import App from './App.vue'
import EgjComponents from '@/components/index.js'
import 'element-ui/lib/theme-chalk/index.css'

import pubTools from '@/plugins/tools.js'

import api from '@/api/common/account'
Vue.config.productionTip = false

Vue.use(Element)
Vue.use(Router)
Vue.use(pubTools)
// 写法1
var modules = [
  EgjComponents
]
var allRoutes = [].concat.apply([], modules
  .map(m => {
    Vue.use(m)
    return m
  })
  .map(m => m.routes !== undefined ? m.routes() : [])
)

const router = new Router({ routes: allRoutes })

new Vue({
  el: '#app',
  render: h => h(App),
  router: router,
  watch: {
    "$route": 'checkLogin'
  },
  methods: {
    checkLogin() {
      if (this.$router.currentRoute.path === "/login") {
        return
      }
      api.checkLogin()
        .then(resp => { })
        .catch(e => {
          if (e.status === 401) {
            this.$router.push("/login");
          } else if (e.data) { // 能获取到状态值的其他情况
            this.$message.error(e.data, 4);
          } else { // 网络连接失败的情况
            this.$message.error(e, 4);
          }
        })
    }
  },
  created: function () {
  }
})

