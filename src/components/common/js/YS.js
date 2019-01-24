const asyncScript = function (array) {
  return new Promise(function (resolve, reject) {
    try {
      let obj
      array.forEach((o, i) => {
        let oldjs = null
        oldjs = document.getElementById(o.id)
        if (!oldjs) {
          var scriptObj = document.createElement('script')
          scriptObj.src = o.url
          scriptObj.type = 'text/javascript'
          scriptObj.id = o.id
          document.getElementsByTagName('head')[0].appendChild(scriptObj)
          if (i === array.length - 1) {
            obj = scriptObj
            obj.onload = function () {
              resolve()
            }
          }
        } else {
          resolve()
        }
      })
    } catch (error) {
      reject(error)
    }
  })
}
export default{
  async YS_jquery () {
    const $ = await import(/* webpackChunkName: "jquery" */ 'jquery')
    return $
  },
  async YS_md5 () {
    const md5 = await import(/* webpackChunkName: "jquery" */ 'md5')
    return md5
  },
  async YS_echarts () {
    const echart = await import(/* webpackChunkName: "echarts" */ 'echarts')
    return echart
  },
  YS_qrcode () {
    return asyncScript([{
      id: 'qrcode',
      url: 'static/YS-frame/qrcode/qrcode.min.js'}])
  },
    // callback
  YS_lodop (callback = () => {}) {
    return asyncScript([{
      id: 'lodop',
      url: 'static/YS-frame/lodop-6.1/LodopFuncs.js'}]).then(() => {
        var judage = function () {
          if (typeof (window.LODOP) !== 'undefined') {
            if (window.LODOP.webskt && window.LODOP.webskt.readyState === 1) {
              callback(window.getLodop)
            } else {
              setTimeout(judage, 200)
            }
          } else {
            setTimeout(judage, 200)
          }
        }
        judage()
      })
  },
  YS_ueditor (callback = () => {}) {
    asyncScript([{
      id: 'ue_config',
      url: 'static/YS-frame/UEditor/ueditor.config.js'
    }, {
      id: 'ue_all',
      url: 'static/YS-frame/UEditor/ueditor.all.js'
    }
    ]).then(() => {
      asyncScript([
        {
          id: 'ue_css',
          url: 'static/YS-frame/UEditor/lang/zh-cn/zh-cn.js'
        },
        {
          id: 'ue_parse',
          url: 'static/YS-frame/UEditor/ueditor.parse.min.js'
        }
      ]).then(() => {
        callback()
      })
    })
  },
  YS_IDValidator (callback = () => { }) {
    return asyncScript([{
      id: 'IDValidator',
      url: 'static/YS-frame/IDValidator/IDValidator.js'
    }, {
      id: 'GB2260',
      url: 'static/YS-frame/IDValidator/GB2260.js'
    }]).then(() => {
      callback()
    })
  },
  YS_wordExport (callback = () => {}) {
    asyncScript([{
      id: 'word_filesaver',
      url: '/static/YS-frame/wordexport/FileSaver.js'
    }, {
      id: 'word_wordexport',
      url: '/static/YS-frame/wordexport/jquery.wordexport.js'
    }
    ]).then(() => {
      callback()
    })
  }
}
