<template>
<div style="float:left">
   <!-- <el-button @click="port" type="success" size="medium" ><a id="Button1" href="" style="display: none;"></a>导出excel</el-button> -->
    <a id="Button1" @click="port" class="abtn">导出EXCEL</a>  
</div>
</template>
<script>
const getExplorer = function () {
  var explorer = window.navigator.userAgent
  if (explorer.indexOf('MSIE') >= 0) {
    // ie
    return 'ie'
  } else if (explorer.indexOf('Firefox') >= 0) {
    // firefox
    return 'Firefox'
  } else if (explorer.indexOf('Chrome') >= 0) {
    // Chrome
    return 'Chrome'
  } else if (explorer.indexOf('Opera') >= 0) {
    // Opera
    return 'Opera'
  } else if (explorer.indexOf('Safari') >= 0) {
    // Safari
    return 'Safari'
  }
}
export default {
  props: {
    tableId: {
      type: String,
      default: '',
      required: true
    },
    tableName: {
      type: String,
      default: '',
      required: true
    }
  },
  methods: {
    port () {
      var idTmr
      const Cleanup = function () {
        window.clearInterval(idTmr)
        window.CollectGarbage()
      }
      let tableToExcel = (function () {
        let uri = 'data:application/vnd.ms-excel;base64,'
        let template =
          '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
        let base64 = function (s) {
          return window.btoa(unescape(encodeURIComponent(s)))
        }
        let format = function (s, c) {
          return s.replace(/{(\w+)}/g, function (m, p) {
            return c[p]
          })
        }
        return function (table, name, filename) {
          // if (!table.nodeType) table = document.getElementById(table)
          // var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }
          // window.location.href = uri + base64(format(template, ctx))
          // if (!table.nodeType) table = document.getElementById(table)
          // console.log(table)
          var div = document.querySelector('#' + table)
          var tables = div.querySelectorAll('table')
          var html = document.createElement('table')
          var thead = document.createElement('thead')
          var tr = document.createElement('tr')
          var tbody = document.createElement('tbody')
          if (table.length > 0 && tables.length === 2) {
            tables[0].querySelectorAll('thead tr th').forEach(o => {
              if (o.innerText !== '操作' && o.innerText !== '' && !o.className.includes('hide')) {
                var th = document.createElement('th')
                th.innerHTML = o.innerText
                tr.appendChild(th)
              }
            })
            html.appendChild(tr)
            html.appendChild(thead)
            tables[1].querySelectorAll('tbody tr').forEach(o => {
              var trd = document.createElement('tr')
              o.querySelectorAll('td').forEach(d => {
                if (d.querySelectorAll('input[type="checkbox"]').length === 0 && d.querySelectorAll('button').length === 0 && !d.className.includes('hide') && !d.className.includes('checkbox')) {
                  var td = document.createElement('td')
                  td.innerHTML = d.innerText
                  trd.appendChild(td)
                }
              })
              tbody.appendChild(trd)
            })
            html.appendChild(tbody)
          }
          var ctx = { worksheet: name || 'Worksheet', table: html.outerHTML }
          // document.getElementById('Button1').download = filename
          // window.location.href = uri + base64(format(template, ctx))
          document.getElementById('Button1').href = uri + base64(format(template, ctx))
          document.getElementById('Button1').download = filename
        }
      })()
      if (getExplorer() === 'ie') {
        var curTbl = document.getElementById(this.tableId)
        var oXL = new window.ActiveXObject('Excel.Application') // 创建AX对象excel
        var oWB = oXL.Workbooks.Add() // 获取workbook对象
        var xlsheet = oWB.Worksheets(1) // 激活当前sheet
        var sel = document.body.createTextRange()
        sel.moveToElementText(curTbl) // 把表格中的内容移到TextRange中
        sel.select() // 全选TextRange中内容
        sel.execCommand('Copy') // 复制TextRange中内容
        xlsheet.Paste() // 粘贴到活动的EXCEL中
        oXL.Visible = true // 设置excel可见属性
        try {
          var fname = oXL.Application.GetSaveAsFilename(
            'Excel.xls',
            'Excel Spreadsheets (*.xls), *.xls'
          )
        } catch (e) {
          print('Nested catch caught ' + e)
        } finally {
          let savechanges = false
          oWB.SaveAs(fname)
          oWB.Close(savechanges) // xls.visible = false;
          oXL.Quit()
          oXL = null
          idTmr = window.setInterval(function () {
            Cleanup()
          }, 1)
        }
      } else {
        tableToExcel(this.tableId, '', this.tableName)
      }
    }
  }
}
</script>
<style scoped>
.abtn{
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    transition: .1s;
    padding: 7px 20px;
    font-size: 14px;
    border-radius: 4px;
    color: #fff;
    background-color: #67c23a;
    border-color: #67c23a;
}
</style>



