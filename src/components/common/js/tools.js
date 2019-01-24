import axios from 'axios'
const debug = (process.env.NODE_ENV !== 'production')
let tools = {
  baseUrl: null,
  // 获取cookie
  setCookie: function (name, value, day) {
    var date = new Date()
    date.setDate(date.getDate() + day)
    document.cookie = name + '=' + value + ';expires=' + date
  },
  // 获取cookie
  getCookie: function (name) {
    var reg = RegExp(name + '=([^;]+)')
    var arr = document.cookie.match(reg)
    if (arr) {
      return arr[1]
    } else {
      return ''
    }
  },
  debugConsole: function () {
    if (debug) {
      console.log(...arguments)
    }
  },
  // 删除cookie
  delCookie: function (name) {
    this.setCookie(name, null, -1)
  },
  getDateAll: function (tm, reg, hms) {
    if (!tm) { return '' }
    // console.log('转换日期，参数tamp是', tm)
    // reg case1 ('1111232323') =>  2015年03月01日
    // reg case else ('1111232323','#') =>  2015#03#01

    // hms case1 ('1111232323', '/', 'hm') => 2015/03/01 10:10
    // hms case2 ('1111232323', '/', 'onlyhm') => 10:10
    // hms case3 ('1111232323', '/', 'hms') => 2015/03/01 10:10:10
    // hms case4 ('1111232323', '/', 'onlyhms') => 10:10:10
    var time = null// 具体时间
    tm = parseInt(tm)
    var date = new Date(tm)
    var year = date.getYear() + 1900
    var month = date.getMonth() + 1
    month = month < 10 ? '0' + month : month
    var day = date.getDate()
    day = day < 10 ? ('0' + day) : day
    var h = date.getHours()
    var m = date.getMinutes()
    var s = date.getSeconds()
    h = h < 10 ? ('0' + h) : h
    m = m < 10 ? ('0' + m) : m
    s = s < 10 ? ('0' + s) : s
    date = reg ? year + reg + month + reg + day : year + '年' + month + '月' + day + '日'
    let date1 = reg ? month + reg + day : month + '月' + day + '日'
    if (hms === 'md') { return date1 }
    if (hms === 'hms' || hms === 'onlyhms') { time = h + ':' + m + ':' + s }
    if (hms === 'hm' || hms === 'onlyhm') { time = h + ':' + m }

    if (time === null) { return date }
    if (hms === 'hms' || hms === 'hm') { return date + ' ' + time }
    if (hms === 'onlyhms' || hms === 'onlyhm') { return time }
    return null
  },
  // 获取距离 今天/指定 天的周数
  // 两时间戳之间相差的周数
  getWeekVal (d, st) {
    const weekTime = 7 * 24 * 60 * 60 * 1000
    let curMonday = this.getMonDayTime(st || new Date().getTime())
    let weekVal = (d + 1000 - curMonday) / weekTime
    weekVal = weekVal > 0 ? parseInt(weekVal) : parseInt(weekVal - 1)
    return weekVal
  },
  // 获取周一开始时间
  // d 时间戳
  getMonDayTime (d) {
    const todayTime = new Date(d).setHours(0, 0, 0, 0) || new Date().setHours(0, 0, 0, 0)
    const todayWeek = new Date(todayTime).getDay()
    const MonDayTime = todayTime - (todayWeek !== 0 ? todayWeek - 1 : 6) * 24 * 60 * 60 * 1000
    return MonDayTime
  },
  // get week label by week number
  getWeekLabel: function () {
    let weekLabels = { '1': '星期一', '2': '星期二', '3': '星期三', '4': '星期四', '5': '星期五', '6': '星期六', '0': '星期日' }
    return function (n) {
      return weekLabels[n] || '未发现！'
    }
  },
  /**
   * Remove an item from an array
   */
  removeArrayItem: function (arr, item) {
    if (arr.length) {
      var index = arr.indexOf(item)
      if (index > -1) {
        return arr.splice(index, 1)
      }
    }
  },
  /**
   * Remove an item from an array
   */
  getItemIndex: function (arr, val, valNa) {
    let idIndex = -1
    if (arr.length) {
      arr.map((item, idx) => {
        item[valNa] === val && (idIndex = idx)
      })
      return idIndex
    } else {
      return idIndex
    }
  },
  /**
   * add an only value item to an array
   */
  addArrayItem: function (arr, item) {
    if (arr.length) {
      var index = arr.indexOf(item)
      if (index > -1) {
        return arr.splice(index, 1)
      }
    }
  },
  /**
   * get array item by key name
   */
  getArrayItems: function (arr, keyName) {
    return arr.map(item => arr[keyName])
  },
  /**
   * Mix properties into target object.
   */
  extend: function (to, _from) {
    for (var key in _from) {
      to[key] = _from[key]
    }
    return to
  },
  /**
   * Mix properties into target object.
   */
  receiveExtend: function (to, _from) {
    for (var key in to) {
      if (_from[key] !== undefined && _from[key] !== null) {
        to[key] = _from[key]
      }
    }
    return to
  },
  /**
   * 累计数组元素中某一项的值
   */
  addUp: function (arr, valNa, la, lv) {
    if (!arr || !arr.length) return 0
    if (la !== undefined && lv !== undefined) {
      return arr.reduceRight((prev, cur, index, array) => {
        return parseFloat(cur[la]) === lv ? prev + parseFloat(cur[valNa]) : prev
      }, 0)
    } else {
      let result = arr.reduceRight((prev, cur, index, array) => {
        return prev + parseFloat(cur[valNa])
      }, 0)
      return result
    }
  },
  tParseInt (v) {
    return v > 0 ? parseInt(v) : -1 * parseInt(-1 * v)
  },
  /**
   * 根据值找label
   * @param {*} arr
   * @param {*} val
   * @param {*} valNa
   * @param {*} labNa
   */
  getLabel (arr, val, valNa = 'id', labNa = 'paraValue') {
    if (!arr.length) {
      console.info('please check arr.length')
      return 0
    }
    let labelValue = null
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][valNa] === val) {
        labelValue = arr[i][labNa]
      }
    }
    return labelValue
  },
  /**
 * 把不足len长度的数字前边补零
 * @param {*} val
 * @param {*} len
 */
  toFloatString (val, nl) {
    let ol = val.toString().length
    if (ol < nl) {
      let lenVal = Math.pow(10, nl)
      return lenVal.toString().slice(ol + 1) + val.toString()
    } else {
      return val
    }
  },
  /**
   * 籍贯  省市
   * @param {*} cityData   省市区数据
   */
  getBirthplace (cityData) {
    let arr = JSON.parse(JSON.stringify(cityData))
    for (let i = 0; i < arr.length; i++) {
      for (let n = 0; n < arr[i].children.length; n++) {
        delete arr[i].children[n].children
      }
    }
    return arr
  },
  /**
   * 省市区分开存储
   *  cityData   省市区数据
   *  pcaArr  选中省市区
   *  pro  暂存字段  省
   *  city 暂存字段  市
   *  area 暂存字段  区
   */
  pcaSeparation (cityData, pcaArr, pro, city, area) {
    cityData.forEach((item, index) => {
      if (item.value === pcaArr[0]) {
        pro = item.label
        item.children.forEach((v, i) => {
          if (v.value === pcaArr[1]) {
            city = v.label
            if (pcaArr.length > 2) {
              v.children.forEach((a, k) => {
                if (a.value === pcaArr[2]) {
                  area = a.label
                }
              })
            } else if (area) {
              area = null
            }
          }
        })
      }
    })
    return [pro, city, area]
  },
  /**
   * 省市区  合并
   *  cityData   省市区数据
   *  isArea  同area
   *  pro   省
   *  city  市
   *  area  区
   */
  pcaMerge (cityData, isArea, pro, city, area) {
    let mergeList = []
    if (pro !== null) {
      cityData.forEach((item, index) => {
        if (item.label === pro && pro) {
          mergeList.push(item.value)
          item.children.forEach((v, i) => {
            if (v.label === city && city) {
              mergeList.push(v.value)
              if (isArea) {
                v.children.forEach((a, k) => {
                  if (a.label === area) {
                    mergeList.push(a.value)
                  }
                })
              }
            }
          })
        }
      })
    }
    return mergeList
  },
  replaceAsync (str, re, callback) {
    // http://es5.github.io/#x15.5.4.11
    str = String(str)
    let parts = []
    let i = 0
    // eslint-disable-next-line
    if (Object.prototype.toString.call(re) == '[object RegExp]') {
      if (re.global) { re.lastIndex = i }
      var m
      // eslint-disable-next-line
      while (m = re.exec(str)) {
        if (m[0].indexOf(';base64,') >= 0) {
          var args = m.concat([m.index, m.input])
          parts.push(str.slice(i, m.index), callback.apply(null, args))
          i = re.lastIndex
          if (!re.global) { break } // for non-global regexes only take the first match
          // eslint-disable-next-line
          if (m[0].length == 0) { re.lastIndex++ }
        }
      }
    } else {
      re = String(re)
      i = str.indexOf(re)
      // eslint-disable-next-line
      parts.push(str.slice(0, i), callback.apply(null, [re, i, str]))
      i += re.length
    }
    parts.push(str.slice(i))
    return Promise.all(parts).then(function (strings) {
      return strings.join('')
    })
  },
  IdCard (UUserCard) {
    // 获取出生日期
    let birth = UUserCard.substring(6, 10) + '-' + UUserCard.substring(10, 12) + '-' + UUserCard.substring(12, 14)
    return birth
  },
  // 判断男女
  isOdd (id) {
    let number = id.substring(16, 17)
    let sign
    if (parseInt(number) % 2 === 0) {
      sign = '0'
    } else {
      sign = '1'
    }
    return sign
  },
  selectDate (date, type) {
    let newDate = null
    if (date) {
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      if (type === 's') {
        newDate = year + '-' + month + '-' + day + ' 00:00:00'
      } else if (type === 'e') {
        newDate = year + '-' + month + '-' + day + ' 23:59:59'
      } else {
        newDate = year + '-' + month + '-' + day
      }
    }
    return newDate
  }

}

function getBaseUrl () {
  if (debug) {
    tools.baseUrl = 'api/'
  } else {
    axios({
      method: 'get',
      url: 'static/address.json'
    })
      .then(res => {
        tools.baseUrl = res.data.address
      })
  }
}
getBaseUrl()
export default tools
