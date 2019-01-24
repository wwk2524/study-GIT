<template>
<div>
   <el-button-group>
    <el-tooltip v-if="type.includes('copy')" popper-class="tipe" effect="light" content="复制" placement="top">
      <el-button  size="small" plain icon="el-icon-document" @click="copy"></el-button>
   </el-tooltip>
   <el-tooltip v-if="type.includes('export')" popper-class="tipe" effect="light" content="导出" placement="top">
  <el-button size="small" plain icon="el-icon-upload2" @click="port"></el-button>
   </el-tooltip>
    <el-tooltip v-if="type.includes('refresh')" popper-class="tipe" effect="light" content="刷新" placement="top">
  <el-button  size="small" plain icon="el-icon-refresh" @click="refresh"></el-button>
  </el-tooltip>
  <el-tooltip v-if="type.includes('printer')"  popper-class="tipe" effect="light" content="打印" placement="top">
  <el-button size="small" plain icon="el-icon-printer" @click="printer"></el-button>
  </el-tooltip>
  <el-tooltip v-if="scrColumn.length>0"  popper-class="tipe" effect="light" content="列筛选" placement="top">
    <el-dropdown :hide-on-click="false">
  <el-button size="small" plain icon="el-icon-sort"></el-button>
    <el-dropdown-menu slot="dropdown">
    <el-dropdown-item v-for="(o,i) in scrColumn" :key="i"> <el-checkbox v-model="o.selected">{{o.text}}</el-checkbox></el-dropdown-item>
  </el-dropdown-menu>
  </el-dropdown>
  </el-tooltip>
</el-button-group>
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
const css =
  '.table-bordered,table {border: 1px solid #000;}.table,table {width: 100%;max-width: 100%;margin-bottom: 20px;}.table,table {border-spacing: 0;border-collapse: collapse;}.table td,table td{border: 1px solid #000;vertical-align: middle;text-align:center;font-size:15px;height:30px;}.table th,table th{padding:6px; vertical-align: top; border: 1px solid #000;text-align:center;  font-weight:bold;  font-size:13px;}.table div{  text-align:center; } .table .w_35{width:35px; }.table .w_100{width:100px; }.editdiv{ width: 100%;  border: 0;  height: 30px;   font-size: 15px;  font-weight: normal;  text-align: center;  line-height:30px; }.ng-table-filters{display:none;};input{width: 100%;border: 0;height:30px;line-height:30px;font-size: 15px;font-weight: normal;text-align: center;}'
export default {
  props: {
    type: {
      type: String,
      default: '',
      required: true
    },
    tableId: {
      type: String,
      default: '',
      required: true
    },
    printOb: {
      type: Object,
      default: function (value) {
        return value || {}
      }
    },
    scrColumn: {
      type: Array,
      default: function (value) {
        return value || []
      }
    }
  },
  methods: {
    copy () {
      var div = document.querySelector('#' + this.tableId)
      var table = div.querySelectorAll('table')
      var html = document.createElement('table')
      if (table.length > 0 && table.length === 2) {
        if (!document.querySelector('#bstableCopy')) {
          var element = document.createElement('textarea')
          // "<textarea id='bstableCopy' cols='20' rows='10' style='opacity: 0;position: fixed;'>复制内容</textarea>"
          element.id = 'bstableCopy'
          element.cols = '20'
          element.rows = '10'
          element.style.opacity = 0
          element.style.position = 'fixed'
          document.querySelector('body').appendChild(element)
        }
        html.innerHTML = table[0].querySelector('thead').outerHTML
        html.innerHTML += table[1].querySelector('tbody').outerHTML
      }
      document.querySelector('#bstableCopy').innerHTML = html.outerHTML
      document.querySelector('#bstableCopy').select() // 选择对象
      document.execCommand('Copy')
      this.$message({
        type: 'success',
        message: '复制成功,请粘贴到Excel表格中!'
      })
    },
    port () {
      var idTmr
      const Cleanup = function () {
        window.clearInterval(idTmr)
        window.CollectGarbage()
      }
      let tableToExcel = (function () {
        let uri = 'data:application/vnd.ms-excel;base64,'
        let template =
          '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
        let base64 = function (s) {
          return window.btoa(unescape(encodeURIComponent(s)))
        }
        let format = function (s, c) {
          return s.replace(/{(\w+)}/g, function (m, p) {
            return c[p]
          })
        }
        return function (table, name) {
          if (!table.nodeType) table = document.getElementById(table)
          var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }
          window.location.href = uri + base64(format(template, ctx))
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
        tableToExcel(this.tableId)
      }
    },
    refresh () {
      this.$emit('refresh')
    },
    printer () {
      // let newstr = document.getElementById(this.tableId).innerHTML
      // 生成并打印ifrme
      let iframe = document.createElement('iframe')
      iframe.style.visibility = 'hidden'
      iframe.style.height = 0
      document.getElementById('app').appendChild(iframe)
      iframe.id = 'printf'
      let f = document.getElementById('printf')
      console.log(iframe)
      var div = document.querySelector('#' + this.tableId)
      var table = div.querySelectorAll('table')
      var html = document.createElement('table')
      var thead = document.createElement('thead')
      var tr = document.createElement('tr')
      var tbody = document.createElement('tbody')
      // 去除 滚动条列 + 选择框列
      if (table.length > 0 && table.length === 2) {
        table[0].querySelectorAll('thead tr th').forEach(o => {
          if (o.innerText !== '' && !o.className.includes('gutter')) {
            var th = document.createElement('th')
            th.innerHTML = o.innerText
            tr.appendChild(th)
          }
        })
        thead.appendChild(tr)
        html.appendChild(thead)
        table[1].querySelectorAll('tbody tr').forEach(o => {
          var trd = document.createElement('tr')
          o.querySelectorAll('td').forEach(d => {
            // 去除 有选框列  +  滚动条列
            if (d.querySelectorAll('input[type="checkbox"]').length === 0 && d.className.includes('is-center') && !d.className.includes('gutter') && !d.className.includes('checkbox')) {
              var td = document.createElement('td')
              td.innerHTML = d.innerText
              trd.appendChild(td)
            }
          })
          tbody.appendChild(trd)
        })
        html.appendChild(tbody)
      }
      var strBodyStyle = '<html><head><style>' + css + '</style></head>'
      var printHtml =
        strBodyStyle + '<body>' + html.outerHTML + '</body></html>'
      f.contentDocument.write(printHtml)
      f.contentDocument.close()
      f.contentWindow.print()
    }
  }
}
</script>

