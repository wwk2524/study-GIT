import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import demo3 from './demo3.vue'
import demoX from './demoX.vue'

const components = [
    demo1,
    demo2,
    demo3,
    demoX
]
const install = function (Vue, opts) {
    components.map(c => {
        Vue.component(c.name, c)
    })
}
const routes = function () {
    return [
        { path: '/wwk/demo1', name: 'demo1', component: demo1 },
        { path: '/wwk/demo2', name: 'demo2', component: demo2 },
        { path: '/wwk/demo3', name: 'demo3', component: demo3 },
        { path: '/wwk/demoX', name: 'demoX', component: demoX }
    ]
}

export default { install, routes }