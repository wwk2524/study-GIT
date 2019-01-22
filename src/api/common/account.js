import endpoint from '../endpoint'
export default {
  login(data) {
    return endpoint.http().post("/account/login", data).then(resp => {
      return resp.data
    }).catch(error => {
      throw error
    })

  },
  checkLogin() {
    return endpoint.http().get("/account/loginstate").then(resp => {
      return resp.data
    }).catch(error => {
      throw error
    })
  },
  getMenus(){
    return endpoint.http().post("/getMenus").then(resp => {
      return resp.data
    }).catch(error => {
      throw error
    })
  }
}
