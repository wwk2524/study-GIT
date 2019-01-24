import demo1 from './demo1.vue'
import demo2 from './demo2.vue'

const components = [
    demo1,
    demo2,
]
const install = function (Vue, opts) {
    components.map(c => {
        Vue.component(c.name, c)
    })
}
const routes = function () {
    return [
        { path: '/wzy/demo1', name: 'wzydemo1', component: demo1 },
        { path: '/wzy/demo2', name: 'wzydemo2', component: demo2 }
    ]
}

export default { install, routes }