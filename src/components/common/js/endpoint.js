/* eslint-disable */
import 'babel-polyfill'
import axios from 'axios'
import tools from './tools.js'

const debug = (process.env.NODE_ENV !== 'production')
const ajax = function (config) {
  const loading = this.$loading({
    lock: true,
    text: 'Loading',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  });
  return axios(config).then(res => {
    let success = true
    loading.close()
    switch (res.data.code) {
      case -1:// 未知异常
      case 0:// 失败
        success = false
        this.$message.error(res.data.desc)
        break
      case -4:// 无访问权限
        success = false
        this.$message.error('无访问权限')
        break
      case 1:// 成功
        success = true
        break
    }
    return new Promise(function func(resolve, reject) {
      if (success) {
        return resolve(res)
      } else {
        return reject(res)
      }
    })
  })
  .catch(err => {
    loading.close()
    console.error(err)
    // console.log('promise return false,make sure this api has defined and the server is working')
  })
}
axios.interceptors.request.use(function (config) {
  config.headers.authorization = sessionStorage.getItem('user_token')// 将接口返回的token信息配置到接口请求中
  config.headers.post['Content-Type'] = sessionStorage.getItem('user_token')// 将接口返回的token信息配置到接口请求中
  return config
}, function (error) {
  return Promise.reject(error)
})
// http response 拦截器
axios.interceptors.response.use(function (response) {
  // （-1接口未知异常；0失败；1接口正常；-2token为空或无效；-3token超时；-4无访问权限;-5用户不存在）
  if (response.data.code === -2 || response.data.code === -3 || response.data.code === -5) { // 具体的判断token失效的参数
    sessionStorage.removeItem('user_token')
    sessionStorage.removeItem('LoginUser')
    if (tools.getCookie('token')) {
      this.$ajax({
        method: 'get',
        url: 'auth/getServiceToken',
        params: { loginAuthToken: tools.getCookie('token'), type: 2 }
      }).then(res => {
        sessionStorage.setItem('user_token', res.data.token)
        sessionStorage.setItem('LoginUser', JSON.stringify(res.data.data))
        this.$router.push({ path: '/' })
      })
    } else {
      tools.delCookie('token')
      this.$router.push({ path: '/login' })
    }
  } else if (response.data.code === -6) {
    sessionStorage.removeItem('user_token')
    sessionStorage.removeItem('LoginUser')
    tools.delCookie('token')
    this.$router.push({ path: '/login' })
  } else {
    return response
  }
}, function (error) {
  return Promise.reject(error)
})

let endpoint = function (config) {

  config.url = tools.baseUrl + config.url  
  return ajax.call(this, config)
}
export default endpoint
