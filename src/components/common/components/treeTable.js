// params:column 表格列标题Array，data 表格数据Array,inputdata 增删改的对象 Object,outdata 输出数据 Array,refresh 是否重新刷新数据
// column:[{check:true 是否复选框}
// {text:'列标题名称 Strng',
// formater:'替换的内容 String',
// width:'列的宽度 String',
// prop:'对应的字段 String',
// tree:'三角箭头图片在哪个字段出现 Boolean'，
// click:"单击事件 Object key:'选择器(必须用name的值) String' value:'事件函数 Function"}]
let array = []
export default {
  data () {
    return {
    }
  },
  props: {
    column: {
      type: Array,
      default: [],
      required: true,
      validator: function (value) {
        return value.length > 0
      }
    },
    data: {
      type: Array,
      default: [],
      required: true,
      validator: function (value) {
        return value.length >= 0
      }
    },
    inputdata: {
      type: Object,
      required: false,
      default: {}
    },
    outdata: {
      type: Array,
      required: false,
      default: []
    },
    id: {
      type: String,
      default: '',
      required: true
    },
    refresh: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    data () {
      if (this.refresh || document.querySelector('#' + this.id + 'Table tbody').innerHTML === '') {
        array = []
        this.loadData(this.data)
        document.querySelector('#' + this.id + 'Table tbody').innerHTML = array.join('')
      }
    },
    inputdata () {
      function creatSonNode (data, index, column) {
        if (column[0].check) {
          array.push('<td style="width:' + (column[0].width || 'auto') + '"><label role="checkbox" class="el-checkbox"><span aria-checked="mixed" class="el-checkbox__input"><span class="el-checkbox__inner"></span><input type="checkbox" class="el-checkbox__original" value=""></span></label></td>')
        }
        column.forEach(o => {
          if (o.check) return
          array.push('<td  style="width:' + (o.width || 'auto') + ';padding-left:' + (o.tree ? index.length * 20 : 0) + 'px" class="' +
            ((o.tree && data['children']) ? 'checktree' : '') + ' ' + (o.tree ? 'tdLeft' : '') + '">' +
            ((o.tree && data['children']) ? '<i class="el-icon-caret-right restoreTrans"></i>' : '') +
            (o.formater || data[o.prop] || '') + '</td>')
        })
      }

      function findPostion (parentId, tableId) {
        let list = Array.prototype.slice.call(document.querySelectorAll('#' + tableId + 'Table tr[data_prid = "' + parentId + '"]'))
        if (list.length > 0) {
          return findPostion(list[list.length - 1].getAttribute('id').substring(1), tableId)
        } else {
          return parentId
        }
      }

      function delNodes (prid, tableId) { // 递归删除子级
        let arr = Array.prototype.slice.call(document.querySelectorAll('#' + tableId + 'Table tr[data_prid = "' + prid + '"]'))
        let parentId = null
        if (arr.length > 0) {
          arr.forEach(re => {
            parentId = re.getAttribute('id').substring(1)
            delNodes(parentId, tableId)
            re.outerHTML = null
          })
        }
        arr.outerHTML = null
      }
      if (this.inputdata.data.length > 0) {
        switch (this.inputdata.type) {
          case 'add':
            this.inputdata.data.forEach(re => {
              // 新建下级的同级 node list
              let nodeList = Array.prototype.slice.call(document.querySelectorAll('#' + this.id + 'Table tr[data_prid = "' + re.knowledgePid + '"]'))
              // 新建tr index 属性值
              let index = nodeList[nodeList.length - 1].attributes.index.value
              index = index.split(',')
              index[index.length - 1] = nodeList.length.toString()
              // 创建新的tr
              let newNode = document.createElement('tr')
              newNode.id = 'a' + re.id
              newNode.setAttribute('index', index.join(','))
              newNode.setAttribute('data_prid', re.knowledgePid)
              if (nodeList[0].className) {
                newNode.setAttribute('class', 'hiden')
              } else {
                newNode.setAttribute('class', ' ')
              }
              // 定位 tr 的位置
              // console.log(nodeList[nodeList.length - 1].getAttribute('id').substring(1))
              let oldNodeId = findPostion(nodeList[nodeList.length - 1].getAttribute('id').substring(1), this.id)
              nodeList[0].parentNode.insertBefore(newNode, Array.prototype.slice.call(document.querySelectorAll('#' + this.id + 'Table tr[id = "a' + oldNodeId + '"]'))[0].nextSibling)

              // 创建td
              array = []
              creatSonNode(re, index, this.column)
              // td 赋给 tr
              document.querySelector('#' + this.id + 'Table tr[id = "a' + re.id + '"]').innerHTML = array.join('')
            })
            break
          case 'edit':
            this.inputdata.data.forEach(re => {
              let arrEdit = Array.prototype.slice.call(document.querySelectorAll('#' + this.id + 'Table tr[id = "a' + re.id + '"] td'))
              if (arrEdit[2].innerHTML.indexOf('</i>') !== -1) { // 判断是否有三角图标
                let str = arrEdit[2].innerHTML.substring(0, arrEdit[2].innerHTML.indexOf('</i>') + 4)
                arrEdit[2].innerHTML = str + re.knowledgeName
              } else {
                arrEdit[2].innerHTML = re.knowledgeName
              }
            })
            break
          case 'delete':
            this.inputdata.data.forEach(re => {
              let arrDel = document.querySelector('#' + this.id + 'Table tr[id = a' + re.id + ']')
              delNodes(re.id, this.id)// 递归删除子级
              arrDel.outerHTML = null
            })
            break
          default:

            break
        }
      }
    }
  },
  methods: {
    // html拼接
    loadData (ob, pid, k) {
      if (Array.isArray(ob)) {
        ob.forEach((d, i) => {
          var index = (k ? (k + ',') : '') + i
          array.push('<tr id="a' + d.id + '" index="' + index + '" data_prid="' + pid + '" class="' + (typeof pid === 'number' ? 'hiden' : '') + '">')
          if (this.column[0].check) {
            array.push('<td style="width:' + (this.column[0].width || 'auto') + '"><label role="checkbox" class="el-checkbox"><span aria-checked="mixed" class="el-checkbox__input"><span class="el-checkbox__inner"></span><input type="checkbox" class="el-checkbox__original" value=""></span></label></td>')
          }
          this.column.forEach(o => {
            if (o.check) return
            array.push('<td  style="width:' + (o.width || 'auto') + ';padding-left:' + (o.tree ? index.split(',').length * 20 : 0) + 'px" class="' +
            ((o.tree && d['children']) ? 'checktree' : '') + ' ' + (o.tree ? 'tdLeft' : '') + '">' +
            ((o.tree && d['children']) ? '<i class="el-icon-caret-right restoreTrans"></i>' : '') +
            (o.formater || d[o.prop] || '') + '</td>')
          })
          array.push('</tr>')
          if (d['children']) {
            this.loadData(d['children'], d.id, index)
          }
        })
      }
    },
    // 事件委托
    clitree (event) {
      var dom = event.target.parentNode
      var arrd = this.data
      var clic = {}
      this.column.forEach(o => {
        if (o.click) {
          Object.assign(clic, o.click)
        }
      })
      var className = Object.keys(clic)
      if (event.target.classList.contains('checktree') || event.target.classList.contains('el-icon-caret-right')) { // 子节点隐藏显示
        let add = (dom.getAttribute('index') || dom.parentNode.getAttribute('index')).split(',')
        let index = add.length
        add.forEach((o, k) => {
          arrd = k === index - 1 ? [arrd[o]] : arrd[o]['children']
        })
        this.nodeChange(arrd)
      } else if (event.target.classList.contains('el-checkbox__inner')) { // 复选框单击事件
        let add = dom.parentNode.parentNode.parentNode.getAttribute('index').split(',')
        let index = add.length
        let arry = []
        add.forEach((o, k) => {
          if (k === add.length - 2) {
            arry.push([arrd[o]])
          } else if (k === add.length - 1) {
            arry.push([arrd[o]])
          }
          arrd = k === index - 1 ? [arrd[o]] : arrd[o]['children']
        })
        let bool = dom.classList.contains('is-checked')
        this.checkTrue(arry[1] ? arry[1] : arry[0], bool)
        this.checkFalse(arry[0][0].id)
      } else if (className.indexOf(event.target.name) > -1 || className.indexOf(event.target.parentNode.name) > -1) {
        let add = (dom.parentNode.getAttribute('index') || dom.parentNode.parentNode.getAttribute('index')).split(',')
        let index = add.length
        let name = (event.target.name || dom.name)
        add.forEach((o, k) => {
          arrd = k === index - 1 ? [arrd[o]] : arrd[o]['children']
        })
        clic[name](arrd[0])
      }
    },
    // 显示隐藏递归
    nodeChange (arrd, bol) {
      var ald = true
      arrd.forEach(d => {
        Array.prototype.slice.call(document.querySelectorAll('#' + this.id + 'Table tr[data_prid="' + d.id + '"]')).forEach(o => {
          if (o.classList.contains('hiden') && !bol) {
            o.classList.remove('hiden')
            ald = false
          } else {
            o.classList.add('hiden')
            ald = true
          }
        })
        if (!bol) {
          document.querySelector('#a' + d.id + ' i').classList.contains('rotatebottomTrans') ? document.querySelector('#a' +
            d.id + ' i').classList.remove('rotatebottomTrans') : document.querySelector('#a' +
            d.id + ' i').classList.add('rotatebottomTrans')
        } else {
          document.querySelector('#a' +
            d.id + ' i').classList.remove('rotatebottomTrans')
        }

        bol = (typeof bol === 'undefined') ? ald : bol
        if (d['children'] && bol) {
          this.nodeChange(d['children'], bol)
        }
      })
    },
    // 子复选框的联动递归
    checkTrue (arrd, bool) {
      arrd.forEach(o => {
        var dom = document.querySelector('#a' + o.id + ' .el-checkbox__input')
        if (bool) {
          dom.classList.remove('is-checked')
        } else {
          dom.classList.remove('is-indeterminate')
          dom.classList.add('is-checked')
        }
        if (o['children']) {
          this.checkTrue(o['children'], bool)
        }
      })
    },
    // 父复选框的联动递归
    checkFalse (id) {
      var arry = Array.prototype.slice.call(document.querySelectorAll('tr[data_prid="' + id + '"]'))
      if (arry.length > 0) {
        var boo = arry.every(o => o.querySelector('.el-checkbox__input').classList.contains('is-checked'))
        let dom = document.querySelector('#a' + id + ' .el-checkbox__input').classList
        if (boo) {
          dom.add('is-checked')
          dom.remove('is-indeterminate')
        } else {
          let bool = arry.some(o => o.querySelector('.el-checkbox__input').classList.contains('is-checked') || o.querySelector('.el-checkbox__input').classList.contains('is-indeterminate'))
          if (bool) {
            dom.add('is-indeterminate')
            dom.remove('is-checked')
          } else {
            dom.remove('is-indeterminate')
            dom.remove('is-checked')
          }
        }
        var im = document.querySelector('#a' + id).getAttribute('data_prid')
        if (document.querySelector('#a' + im)) {
          this.checkFalse(im)
        }
      }
    },
    // 全选
    checkAll () {
      var checkdom = document.querySelector('#checkd .el-checkbox__input').classList
      var checkall = Array.prototype.slice.call(document.querySelectorAll('#' + this.id + 'Table .el-checkbox__input'))
      if (checkdom.contains('is-checked')) {
        checkdom.remove('is-checked')
        checkall.forEach(o => {
          o.classList.contains('is-checked') && o.classList.remove('is-checked')
          o.classList.contains('is-indeterminate') && o.classList.remove('is-indeterminate')
        })
      } else {
        checkdom.add('is-checked')
        checkall.forEach(o => {
          o.classList.contains('is-indeterminate') && o.classList.remove('is-indeterminate')
          !o.classList.contains('is-checked') && o.classList.add('is-checked')
        })
      }
    }
  }
}
