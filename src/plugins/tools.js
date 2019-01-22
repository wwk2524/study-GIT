// 向Vue 全局注册方法

const install = function (Vue, opt) {
  let tools = {
    /**
     * 获取时间戳 
     * @param {*} p 默认0 表示今天 昨天传值-1 明天传值1 以此类推 支持小数
     */
    getTimestamp(p = 0) {
      return new Date().getTime() + parseFloat(p) * 24 * 60 * 60 * 1000
    },
    /**
     * 时间戳转日期/获取当前日期
     * @param {*} stamp 时间戳 默认当前时间 
     * @param {*} formatNa 时间格式 默认只有一个 待完善
     */
    formatStamp(stamp = new Date().getTime(), formatNa = 'Y-M-D') {
      if (typeof parseInt(stamp) !== 'number') {
        console.error('参数（时间戳）有误！')
        return false
      }
      var time = new Date(parseInt(stamp)),
        y = time.getFullYear(),
        Y = y > 10 ? y : '0' + y,
        m = time.getMonth() + 1,
        M = m > 10 ? m : '0' + m,
        d = time.getDate(),
        D = d > 10 ? d : '0' + d,
        h = time.getHours(),
        mm = time.getMinutes(),
        s = time.getSeconds(),
        DArr = [Y, M, D];
      return DArr.join('-')
    }
  }
  Vue.prototype._tools = tools
}
module.exports = {
  install
}
