import returnBtn from '@/components/common/components/returnBtn'
import tableBar from '@/components/common/components/tableBar'
import applyInfo from '@/components/common/dialog/classApplyInfo'
export default {
  name:'approvalList',
  components: {
    returnBtn,
    tableBar,
    applyInfo
  },
  data () {
    return {
      query: '',
      copyData: [],
      tableData: [],
      searchData: [],
      classStatusLabels: ['待确认', '已确认', '已驳回', '下一级审批'],
      scrColumn: {
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
        classStatus: {
          text: '状态',
          selected: true,
          field: 'approveStatus'
        }
      },
      approveStatus: '',
      curClassInfo: {
        courseChargesList: [],
        textbookChargesList: {},
        otherChargesList: []
      },
      approveList: [],
      createData: '',
      dialogVisible: false,
      dialogFormVisible: false,
      turnDownId: '',
      selectIsOk: false,
      turnDownForm: {
        content: ''
      },
      turnDownRules: {
        content: [{
          required: true,
          message: '请输入驳回意见',
          trigger: 'blur'
        },
        {
          min: 1,
          max: 100,
          message: '长度在 1 到 100 个字符',
          trigger: 'blur'
        }
        ]
      },
      dialogApprovalFlow: false,
      ApprovalFlowData: [],
      isClassTeacher: false,
      // 页码相关
      total: 1, // 数据总条数
      size: 20, // 每页数据条数
      sizeArr: [20, 50, 100],
      currentPage: 1 // 当前页数
    }
  },
  mounted () {
    this.getTblData()
  },
  methods: {
    // 初始查询
    getTblData () {
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/applyformController/selectApproveList',
        data: {}
      })
        .then(res => {
          if (res.data.code > 0) {
            res.data.data.allAylanmam.forEach(item => {
              item.classCode = item.classInfos[0].classCode
              item.natureName = item.classInfos[0].natureName
              item.specialtyName = item.classInfos[0].specialtyName
              item.classTime = item.classInfos[0].classTime
              item.startDate = item.classInfos[0].startDate
              item.classAddrName = item.classInfos[0].classAddrName
              item.tuition = item.classInfos[0].tuition
              item.surplusTotal = item.classInfos[0].surplusTotal
              item.classStatus = item.classInfos[0].classStatus
            })
            this.copyData = res.data.data.allAylanmam
            this.tableData = this.copyData.slice(0, this.size * 1)
            this.total = this.copyData.length
            this.currentPage = 1
          } else {
            this.$message.error(res.data.desc)
          }
        })
    },
    // 每页数据条数改变
    handleSizeChange (val) {
      this.size = val
      this.handleCurrentChange()
    },
    // 当前页面改变
    handleCurrentChange (val) {
      this.currentPage = val || this.currentPage
      if (this.query) {
        this.tableData = this.searchData.slice(
          (this.currentPage - 1) * this.size,
          this.currentPage * this.size
      )
      } else {
        this.tableData = this.copyData.slice(
          (this.currentPage - 1) * this.size,
          this.currentPage * this.size
        )
      }
    },
    confirmBy (id) {
      let params = {
        'id': parseInt(this.turnDownId) || id,
        'confType': '1', // 后期活动
        'applyformComment': {
          'approveStatus': '1',
          'content': ''
        }
      }
      this.$confirm('确认通过吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$ajax({
          method: 'post',
          url: 'baseInfo/applyformController/holidayApprove',
          data: params
        }).then((res) => {
          if (res.data.code === 1) {
            this.dialogVisible = false
            this.$message.success('已通过!')
            this.getTblData()
          } else {
            this.$message.error(res.data.desc)
          }
        })
      }).catch(() => {
        this.$message('已取消')
      })
    },
    turnDownDialog () {
      this.dialogFormVisible = true
    },
    turnDownOk (formName) {
      if (this.approveStatus === '2') {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$ajax({
              method: 'post',
              url: 'baseInfo/applyformController/updateApplyformComment',
              data: {
                'id': this.approveList.id,
                'content': this.turnDownForm.content
              }
            }).then(res => {
              if (res.data.code === 1) {
                this.dialogFormVisible = false
                this.dialogVisible = false
                this.getTblData()
                this.$message.success('修改成功')
              } else {
                this.$message.error(res.data.desc)
              }
            })
          }
        })
      } else {
        let params = {
          'id': parseInt(this.turnDownId),
          'confType': '1',
          'applyformComment': {
            'approveStatus': '2',
            'content': this.turnDownForm.content
          }
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$ajax({
              method: 'post',
              url: 'baseInfo/applyformController/holidayApprove',
              data: params
            }).then((res) => {
              if (res.data.code === 1) {
                this.dialogFormVisible = false
                this.dialogVisible = false
                this.getTblData()
                this.$message.success('已驳回')
              } else {
                this.$message.error(res.data.desc)
              }
            })
          }
        })
      }
    },
    // 展示详情
    showDetial (row) {
      this.$ajax({
        method: 'post',
        url: 'baseInfo/setUp/selectSetupClassInfoById/' + row.classInfos[0].id
      }).then(res => {
        if (res.data.code === 1) {
          this.curClassInfo = res.data.list[0]
          let userId = sessionStorage.getItem('user_id')
          if (parseInt(userId) === this.curClassInfo.creatorId) {
            this.isClassTeacher = true
          } else {
            this.isClassTeacher = false
          }
        } else {
          this.$message.error(res.data.desc)
        }
      })
      this.turnDownId = row.id
      this.approveStatus = row.approveStatus
      this.createData = row.createDate
      if (row.list && row.list.length > 0) {
        this.approveList = row.list[row.list.length - 1]
        this.turnDownForm.content = this.approveList.content
      }
      this.dialogVisible = true
    },
    // 关闭驳回弹窗
    closeDialogFormVisible (formName) {
      this.$refs[formName].resetFields()
    },
    // 显示驳回原因
    showTurnDown (list) {
      let con = list[list.length - 1]
      this.$alert('驳回意见：' + con.content, '驳回意见', {
        confirmButtonText: '确定',
        type: 'warning'
      })
    },
    selectApprovalFlow (row) {
      this.$ajax({
        method: 'post',
        url: 'baseInfo/applyformController/getApplyformDetail',
        data: {
          'applyformId': row.id,
          'specialtyId': row.specialtyId
        }
      }).then(res => {
        if (res.data.code === 1) {
          this.ApprovalFlowData = res.data.data.processConfs
          this.dialogApprovalFlow = true
        } else {
          this.$message.error(res.data.desc)
        }
      })
    }
  },
  watch: {
    query (newVal, oldVal) {
      if (newVal.trim() !== '' && !this.selectIsOk) {
        this.searchData = this.copyData.filter(o => {
          return Object.values(this.scrColumn).filter((item) => {
            return item.selected && !item.noSearch
          }).some(d => {
            return (d.value && d.value.indexOf(newVal.trim()) > -1) || (o[d.field] && ((typeof o[d.field] === 'string') ? o[d.field].indexOf(newVal) > -1 : o[d.field].toString().indexOf(newVal) > -1))
          })
        })
        this.tableData = this.searchData.slice(0, this.size * 1)
        this.total = this.searchData.length
      } else if (newVal.trim() !== '' && this.selectIsOk) {
        this.searchData = this.searchData.filter(o => {
          return Object.values(this.scrColumn).filter((item) => {
            return item.selected && !item.noSearch
          }).some(d => {
            return (d.value && d.value.indexOf(newVal.trim()) > -1) || (o[d.field] && ((typeof o[d.field] === 'string') ? o[d.field].indexOf(newVal) > -1 : o[d.field].toString().indexOf(newVal) > -1))
          })
        })
        this.tableData = this.searchData.slice(0, this.size * 1)
        this.total = this.searchData.length
      } else {
        this.selectIsOk = false
        this.tableData = this.copyData.slice(
          (this.currentPage - 1) * this.size,
          this.currentPage * this.size
        )
        this.total = this.copyData.length
      }
    },
    selectIsOk (newVal) {
      if (newVal === true && !this.query) {
        this.searchData = this.copyData.filter(o => {
          return Object.values(this.scrColumn).filter((item) => {
            return item.selected && !item.noSearch
          }).some(d => {
            return (d.value && d.value === '0') || (o[d.field] && ((typeof o[d.field] === 'string') ? o[d.field] === '0' : o[d.field].toString() === '0'))
          })
        })

        this.tableData = this.searchData.slice(0, this.size * 1)
        this.total = this.searchData.length
      } else if (newVal === true && this.query) {
        this.searchData = this.searchData.filter(o => {
          return Object.values(this.scrColumn).filter((item) => {
            return item.selected && !item.noSearch
          }).some(d => {
            return (d.value && d.value === '0') || (o[d.field] && ((typeof o[d.field] === 'string') ? o[d.field] === '0' : o[d.field].toString() === '0'))
          })
        })

        this.tableData = this.searchData.slice(0, this.size * 1)
        this.total = this.searchData.length
      } else {
        this.query = null
        this.tableData = this.copyData.slice(
          (this.currentPage - 1) * this.size,
          this.currentPage * this.size
        )
        this.total = this.copyData.length
      }
    }
  }
}
