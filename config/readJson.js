// Template version: 1.2.4
// see http://vuejs-templates.github.io/webpack for documentation.
// 配置本地node服务端读取JSON文件
var http = require('http')
var fs = require('fs')
var server = http.createServer(function (req, res) {
  var url_info = require('url').parse(req.url, true)
  console.log('url_info', url_info)
  let urlPath = url_info.pathname
  // 截取 以 /1 等结尾的 id类型的请求
  const pattern = /\/[0-9]+/g
  var resArr = urlPath.match(pattern)
  if (resArr && resArr.length) {
    urlPath = urlPath.slice(0, urlPath.lastIndexOf(resArr.pop()))
  }
  var file = './json/pc' + urlPath + '.json'
  console.log(file)
  fs.exists(file, exists => {
    var result = {
      code: 0,
      desc: url_info.pathname + '.json文件不存在'
    }
    if (exists) {
      result = JSON.parse(fs.readFileSync(file))
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8'
      })
    } else {
      res.writeHead(400, {
        'Content-Type': 'application/json; charset=utf-8'
      })
    }
    res.end(JSON.stringify(result))
    res.end(result.join)
  })
})

// server.listen(4444, '127.0.0.1')
module.exports = server
