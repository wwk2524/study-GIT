import returnBtn from '@/common/components/returnBtn'
import tableBar from '@/common/components/tableBar'
import classTime from '@/components/common/select/classTime'
import classStatus from '@/components/common/select/classStatus'
import schoolArea from '@/components/common/select/schoolArea'
import applyInfo from '@/components/common/dialog/classApplyInfo'

export default {
  components: {
    tableBar,
    classTime,
    classStatus,
    schoolArea,
    applyInfo,
    returnBtn
  }, // 表格功能组件 返回键
  data() {
    return {
      // 查询条件
      queryCondition: {
        classTime: null,
        classAddr: null,
        classStatus: null,
        arg1: null
      },
      tableData: [],
      selectRows: [],
      schoolAreaOptionList: [],
      classStatusLabels: ['已确认', '未确认', '驳回'], // 已确认，未确认、驳回
      // backUps: null,
      // copyData: null,

      dialogVisible: false, // 弹出框
      curClassInfo: {
        // courseChargesList: [],
        // textbookChargesList: {},
        // otherChargesList: []
      },
      scrColumn: {
        classCode: {
          text: '班级代码',
          selected: true,
          field: 'classCode'
        },
        natureName: {
          text: '性质',
          selected: true,
          field: 'natureName'
        },
        specialtyName: {
          text: '工种',
          selected: true,
          field: 'specialtyName'
        },
        classTime: {
          text: '上课时间',
          selected: true,
          field: 'classTime'
        },
        startDate: {
          text: '开班日期',
          selected: true,
          field: 'startDate'
        },
        classAddrName: {
          text: '开班地点',
          selected: true,
          field: 'classAddrName'
        },
        tuition: {
          text: '学费标准',
          selected: true,
          field: 'tuition'
        },
        // surplusTotal: {
        //   text: '结余',
        //   selected: true,
        //   field: 'surplusTotal'
        // },
        classStatus: {
          text: '状态',
          selected: true,
          field: 'classStatus'
        },
        otherField: {
          text: '操作',
          selected: true,
          noSearch: true
        } // 不进行模糊搜索列
      },
      // 页码相关
      total: 1, // 数据总条数
      size: 20, // 每页数据条数
      sizeArr: [20, 50, 100],
      currentPage: 1, // 当前页数
      stuListVisible: false,
      stuList: [], // 意向学生列表
      stu: {

        copyData: null,
        total: 1, // 数据总条数
        size: 10, // 每页数据条数
        sizeArr: [20, 50, 100],
        currentPage: 1 // 当前页数
      }
    }
  },
  methods: {
    // 关闭弹框
    coloseDialog() {
      this.dialogVisible = false
    },
    // 初始查询
    getTblData() {
      var sendData = JSON.parse(JSON.stringify(this.queryCondition))
      sendData.pageNum = this.currentPage
      sendData.pageSize = this.size
      this.$ajax({
          method: 'POST',
          url: 'baseInfo/setUp/selectSetupClassInfoList',
          data: sendData
        })
        .then(res => {
          if (res.data.code > 0) {
            this.tableData = res.data.data.list
            this.total = res.data.data.total
          } else {
            this.$message.error(res.data.desc)
          }
        })
        .catch(err => console.log(err))
    },
    // 重置
    resetSearch() {
      this.queryCondition.classTime = null
      this.queryCondition.classAddr = null
      this.queryCondition.classStatus = null
      this.queryCondition.arg1 = null
      this.currentPage = 1
      this.getTblData()
    },
    // 删除
    delTblRow(row) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$ajax({
            method: 'POST',
            url: 'baseInfo/setUp/deleteSetupClassInfo/' + row.id,
            data: {}
          })
          .then(res => {
            if (res.data.code > 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getTblData()
            } else {
              this.$message.error(res.data.desc)
            }
          })
          .catch(err => console.log(err))
      })
    },
    // 每页数据条数改变
    handleSizeChange(val) {
      this.size = val
      this.handleCurrentChange()
    },
    // 当前页面改变
    handleCurrentChange(val) {
      this.currentPage = val || this.currentPage
      this.getTblData()
      // this.tableData = this.copyData.slice(
      //   (this.currentPage - 1) * this.size,
      //   this.currentPage * this.size
      // )
    },
    // 学生列表翻页
    stuPageChange(val) {
      this.stu.currentPage = val || this.stu.currentPage
      this.stuList = this.stu.copyData.slice(
        (this.stu.currentPage - 1) * this.stu.size,
        this.stu.currentPage * this.stu.size
      )
    },
    // 学生列表 条数改变
    stuPageSizeChange(val) {
      this.stu.size = val
      this.stuPageChange()
    },
    // 新开班
    applyNew() {
      this.$router.push('/signUp/apply')
    },
    // 编辑
    editTblRow(row) {
      this.$router.push('/signUp/apply/' + row.id)
    },
    // 展示详情
    showDetail(row) {
      this.$ajax({
          method: 'POST',
          url: 'baseInfo/setUp/selectSetupClassInfoById/' + row.id,
          data: {}
        })
        .then(res => {
          if (res.data.code > 0) {
            let data = res.data.list[0]
            this.curClassInfo = data
            this.dialogVisible = true
          } else {
            this.$message.error(res.data.desc)
          }
        })
        .catch(err => console.log(err))
    },
    // 学生列表
    showIntentStus(row) {

      this.stuList = []
      this.stu.copyData = []
      this.stu.classCode = row.classCode
      this.$ajax({
          method: 'POST',
          // url: 'baseInfo/setUp/selectIntentionPersonByClassId/' + row.id,
          url: 'baseInfo/setUp/selectIntentionPersonBySpecialtyId/' + row.specialty,
          data: null
        })
        .then(res => {
          if (res.data.code > 0) {
            this.stu.copyData = JSON.parse(JSON.stringify(res.data.list))
            this.stuList = this.stu.copyData.slice(0, this.stu.size * 1)
            this.stu.total = this.stu.copyData.length
            this.stu.currentPage = 1
            this.stuListVisible = true
          } else {
            this.$message.error(res.data.desc)
          }
        })
        .catch(err => console.log(err))
    }
  },
  created() {
    this.getTblData()
  }
}
