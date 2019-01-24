export default [
  {
    path: '/signUp/intent',
    name: '报名管理>开班申请>意向列表',
    component: () => import(/* webpackChunkName: "intent" */ './intent')
  },
  {
    path: '/signUp/classes',
    name: '报名管理>开班申请>开班列表',
    component: () => import(/* webpackChunkName: "classes" */ './classes')
  },
  {
    path: '/signUp/apply/:id',
    name: 'applyClass',
    component: () => import(/* webpackChunkName: "apply" */ './apply')
  },
  {
    path: '/signUp/apply',
    name: 'applyClassNew',
    component: () => import(/* webpackChunkName: "apply" */ './apply')
  },
  {
    path: '/signUp/approvalList',
    name: '报名管理>开班申请审批>审批列表',
    component: () => import(/* webpackChunkName: "approvalList" */ './approvalList')
  },
  {
    path: '/signUp/preSignUpList',
    name: '报名管理>学籍登记>预报名学生列表',
    component: () => import(/* webpackChunkName: "preSignUpList" */ './preSignUpList')
  },
  {
    path: '/signUp/addStudent',
    name: '报名管理>学籍登记>新增学生',
    component: () => import(/* webpackChunkName: "preSignUpList" */ './addStudent')
  }
]
