import returnBtn from '@/components/common/components/returnBtn'
import tableBar from '@/components/common/components/tableBar'
import schoolArea from '@/components/common/select/schoolArea'
import api from "@/api/common/account";

export default {
  name: 'intent',
  components: {
    tableBar,
    schoolArea,
    returnBtn
  }, // 表格功能组件 返回键
  data () {
    return {
      tableData: [],
      query: { arg1: null, classAddr: null },
      scrColumn: {
        categoryName: { text: '类别', selected: true, field: 'categoryName' },
        specialtyName: { text: '工种', selected: true, field: 'specialtyName' },
        classAddrName: { text: '开班地点', selected: true, field: 'classAddrName' },
        tuition: { text: '学费标准', selected: true, field: 'tuition' },
        peopleNumber: { text: '当前意向人数', selected: true, field: 'peopleNumber' },
        otherField: {
          text: '操作',
          selected: true,
          noSearch: true
        }
      },
      // 页码相关
      total: 1, // 数据总条数
      size: 20, // 每页数据条数
      sizeArr: [20, 50, 100],
      currentPage: 1, // 当前页数

      specialtyVisible: false,
      specialtyDetail: {
        bookList: [],
        specialtyTeachers: {'1': {}, '2': {}, '3': {}, '4': {}}
      },
      signUpOptions: [],
      signUpAddTxt: '',
      classAddrTxt: '',
      stu: {
        copyData: null,
        tableData: null,
        stuListVisible: false,
        total: 1,
        size: 10,
        sizeArr: [10, 20, 50, 100],
        currentPage: 1
      }
    }
  },
  methods: {
    // 初始查询
    getTblData () {
      // 后端分页
      let sendData = JSON.parse(JSON.stringify(this.query))
      sendData.pageNum = this.currentPage
      sendData.pageSize = this.size

      api
      .selectPastPeriodClass(sendData)
      .then(res => {
          if (res.code > 0) {
            this.tableData = res.data.list
            this.tableData.forEach(element => {
              if (element.classAddrName) {
                element.classAddrName = element.classAddrName.split(' ')[0]
              }
            })
            // 后端分页
            this.total = res.data.total
          } else {
            this.$message.error(res.desc)
          }
        })
        .catch(err => console.log(err))
    },
    // 重置
    resetSearch () {
      this.query.arg1 = null
      this.query.classAddr = null
      this.getTblData()
    },
    // 每页数据条数改变
    handleSizeChange (val) {
      this.size = val
      this.handleCurrentChange()
    },
    // 当前页面改变
    handleCurrentChange (val) {
      this.currentPage = val || this.currentPage
      this.getTblData()
    },
    // 显示工种介绍
    showSpecialty2 (id) {
      // url: 'baseInfo/parameter/getSpecialtyDetail/' + id,
      Promise.all([this.$ajax({
        method: 'GET',
        url: 'baseInfo/parameter/getPurposeSpecialtyDetail/' + id,
        data: null
      }), this.$ajax({
        method: 'GET',
        url: 'baseInfo/parameter/getSpecialtyTextbooks/' + id,
        data: null
      })])
        .then(resultList => {
          let resSpe = resultList[0]
          let resBook = resultList[1]
          if (resSpe.data.code > 0) {
            if (resSpe.data.data) {
              this.specialtyDetail = resSpe.data.data
              this.specialtyVisible = true
            } else {
              this.$message.error('未找到该工种的相关信息！')
            }
          }
          if (resBook.data.code > 0) {
            this.specialtyDetail.bookList = resBook.data.list
          }
        })
    },
     // 意向人员列表
    showSpecialty (id) {
      this.$ajax({
        method: 'GET',
        url: 'baseInfo/parameter/getPurposeSpecialtyDetail/' + id,
        data: null
      })
        .then(res => {
          if (res.data.code > 0) {
            if (!res.data.data.specialtyDetail) {
              this.$message.info('没找到更多信息！')
              return false
            }
            this.specialtyDetail = res.data.data.specialtyDetail || {}
            this.specialtyDetail.bookList = res.data.data.textbooks
            let objs = res.data.data.specialtyTeachers
            for (let t in objs) {
              this.specialtyDetail['teacherWages' + objs[t].type] = objs[t].wages
            }
            this.specialtyVisible = true
          } else {
            this.$message.error(res.data.desc)
          }
        })
        .catch(err => console.log(err))
    },
    // 意向人员列表
    showStuList (id) {
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/setUp/selectIntentionPersonBySpecialtyId/' + id,
        data: null
      })
        .then(res => {
          if (res.data.code > 0) {
            this.stu.copyData = JSON.parse(JSON.stringify(res.data.list))
            this.stu.stuList = this.stu.copyData.slice(0, this.stu.size * 1)
            this.stu.total = this.stu.copyData.length
            this.stu.currentPage = 1
            this.stu.stuListVisible = true
          } else {
            this.$message.error(res.data.desc)
          }
        })
        .catch(err => console.log(err))
    },
    // 学生列表翻页
    stuPageChange (val) {
      this.stu.currentPage = val || this.stu.currentPage
      this.stu.stuList = this.stu.copyData.slice(
        (this.stu.currentPage - 1) * this.stu.size,
        this.stu.currentPage * this.stu.size
      )
    },
    // 学生列表 条数改变
    stuPageSizeChange (val) {
      this.stu.size = val
      this.stuPageChange()
    },
    // 新开班
    applyNew (specialty) {
      this.$router.push({ path: '/signUp/apply', query: { specialty: specialty } })
    },

    // 关闭 弹窗
    handleClose () {
      this.signUpAddTxt = ''
      this.classAddrTxt = ''
    }
  },
  created () {
    this.getTblData()
  }
}
