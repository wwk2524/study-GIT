export default {
  props: {
    classId: {
      type: [String, Number]
    },
    generaltableId: {
      type: [String, Number]
    },
    isEdit: {
      default: false
    }
  },
  data() {
    return {
      dynamicValidateForm: {
        domains: [{
          value: ''
        }]
      },
      formData: {
        classPayList: []
      },
      showPayList: [],
      tableData: [],
      baseInfo: {},
      timeFrame: {
        startTime: null,
        endTime: null
      }
    }
  },
  methods: {
    // 查询
    getTableData() {
      let sendData = {}
      this.classId && (sendData.classId = this.classId)
      this.generaltableId && (sendData.generaltableId = this.generaltableId)
      let url = this.isEdit ? 'baseInfo/generaltableAction/findRewardDetail' : 'baseInfo/generaltableAction/findRewardDetailList'
      this.$ajax({
        method: 'POST',
        url: url,
        data: sendData
      }).then(res => {
        if (res.data.code > 0) {
          if (this.isEdit) {
            this.baseInfo = res.data.data.rewardVos
            // 后端 bug 教师的课时都是空
            this.formData.classPayList = res.data.data.rewardVos.rewards
            this.tableData = res.data.data.statisticsVos
          } else {
            this.showPayList = res.data.data.rewardVos
            this.tableData = res.data.data.statisticsVos
          }
        } else {
          this.$message.error(res.data.desc)
        }
      })
        .catch(err => console.log(err))
    },
    // 判断当前行背景色
    tableRowClassName({ row, rowIndex }) {
      if(!this.timeFrame.startTime || !this.timeFrame.endTime){
        return ''
      }
      if (row.courseDate > this.timeFrame.startTime && row.courseDate < this.timeFrame.endTime) {
        return 'grayrow'
      } else {
        return '';
      }
    },
    submitSigin() {
      if (this.$refs.formData) {
        this.$refs.formData.validate((valid) => {
          if (valid) {
            let sendData = this.initSendData()
            this.$ajax({
              method: 'POST',
              url: 'baseInfo/generaltableAction/saveReardDetail',
              data: sendData
            }).then(res => {
              this.$message.success('操作成功！')
            })
              .catch(err => console.log(err))
          } else {
            this.$message.error('请检查输入情况！')
          }
        })
      }
    },
    initSendData() {
      let sendData = {}
      sendData.generaltableId = '只有新增情况 只有classcode'
      // sendData.signinRecordIds = this.formData.tableData.map(item => { })
      sendData.signinRecordIds = '前端无法判断 需要时间戳！/建议自己过滤'
      sendData.rewards = this.formData.classPayList.map((item, idx) => {
        return {
          id: item.id,
          generaltableId: item.generaltableId,
          classId: item.classId,
          teacherId: item.teacherId,
          subsidy: item.subsidy,
          remark: item.remark,
          totalAmount: 0
        }
      })
      return sendData
    },
    goBack() {
      history.go(-1)
    },
    // 累加老师课酬
    getTeacherCharge(item) {
      let chargeArr = item.courseCharges
      function addUp(total, currentValue, currentIndex, arr) {
        return total + currentValue.chargesPrice * currentValue.classPeriod
      }
      return chargeArr.reduce(addUp, 0) + (parseFloat(item.subsidy) || 0)
    }
  },
  created() {
    this.timeFrame = JSON.parse(sessionStorage.getItem('time_frame')) || {}
    this.getTableData()
  }
}
