import endpoint from '@/api/endpoint'
export default {
  /**
   * 获取学生列表
   */
  getStuList () {
    // var path = 'stumanage/list'
    // return endpoint.http().post(path).then(resp => resp.data).catch(error => {
    //   if (error.response) {
    //     throw error.response.data
    //   } else {
    //     throw error
    //   }
    // })
    var data = { list: [{ name: '张山', age: 12, id: '123' }] }
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve(data)
      }, 700)
    })
  }
}
