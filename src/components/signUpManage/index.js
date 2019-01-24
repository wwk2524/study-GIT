// import addStudent from './addStudent.vue'
// import apply from './apply.vue'
// import approvalList from './approvalList.vue'
import intent from './intent.vue'

var components = [
    intent
]

/* istanbul ignore next */
const install = function (Vue, opts) {
  components.map(c => {
    Vue.component(c.name, c)
  })
}

const routes = function () {
  return [
    { path: '/stumanage/intent', name: 'intent', component: intent }
  ]
}

export default { install, routes }
