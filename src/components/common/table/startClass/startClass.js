function simpleCount(t) {
  let h = parseInt(t / (60 * 60))
  let m = parseInt((t % (60 * 60)) / 60)
  let s = parseInt((t % (60 * 60) % 60))
  return h + ':' + m + ':' + s
}
export default {
  props: {
    inhand: {
      type: Number,
      required: true
    },
    refesh: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    refesh(n, o) {
      this.getTableData()
    }
  },
  data() {
    return {
      tableData: [],
      // 状态（0 草稿 1 审批中 2 通过 3 驳回 null 刚开班审批过来的 4延期审批中 5延期通过  6 延期驳回）
      sLabels: ['草稿', '审批中', '通过', '驳回', '延期审批中', '延期通过', '延期驳回'],
      query: null,
      page: {
        page: 1,
        size: 20,
        sizeArr: [20, 50, 100],
        total: 0
      },
      delayVisable: false,
      ApprovalFlowData: {},
      dialogApprovalFlow: false,
      delayInfo: {
        classId: null,
        delayStartDate: null,
        delayEndDate: null,
        delayClosingUpDate: null,
        delayDesc: null,
        courseInfoId: null
      },
      delayRule: {
        delayStartDate: [{
          required: true,
          message: '不能为空',
          trigger: 'change'
        }, {
          validator: this.checkStartDate,
          trigger: 'change'
        }],
        delayEndDate: [{
          required: true,
          message: '不能为空',
          trigger: 'change'
        }, {
          validator: this.checkDateLogic,
          trigger: 'change'
        }],
        delayClosingUpDate: [{
          required: true,
          message: '不能为空',
          trigger: 'change'
        }, {
          validator: this.checkSignUpDate,
          trigger: 'change'
        }],
        delayDesc: [{ required: true, message: '不能为空', trigger: 'blur' }, { max: 30, message: '请输入1-30个字符', trigger: 'blur' }]
      },

      dialogVisable: false,
      dialogTableData: [],
      dialogBaseInfo: {},
      dismissalVisable: false,
      currentRow: {},
      tempRow: {}

    }
  },
  methods: {
    updataDialog() {
      if (this.tempRow.type === 'signup') {
        this.dialogTableData = this.tableData[this.tempRow.idx].preStudentInfoList
      } else {
        this.dialogTableData = this.tableData[this.tempRow.idx].payStudentInfoList
      }
    },
    getTableData() {
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/courseInfo/findCourseInfoByPage',
        data: {
          pageNum: this.page.page,
          pageSize: this.page.size,
          isClose: this.inhand,
          queryValue: this.query
        }
      })
        .then(res => {
          if (res.data.code > 0) {
            this.tableData = res.data.data.list
            this.page.total = res.data.data.total
            if (this.dialogVisable) {
              this.updataDialog()
            }
          } else {
            this.$message.error(res.data.desc)
          }
        })
        .catch(err => console.log(err))
    },
    // 延期按钮是否渲染
    canDelay(row) {
      if (this.inhand !== 1) { return false }
      if (parseInt(row.status) === 1 || parseInt(row.status) === 2 || parseInt(row.status) === 4) {
        return false
      }
      return true
    },
    sizeChange(s) {
      this.page.size = s
      this.getTableData()
    },
    pageChange(p) {
      this.page.page = p
      this.getTableData()
    },
    resetSearch() {
      this.query = null
      this.getTableData()
    },
    // 延期
    delay(row) {
      this.delayInfo.courseInfoId = row.id // 开课id
      this.delayInfo.classId = row.classId // 班级id
      this.delayVisable = true
    },
    ensureDelay() {
      this.$refs['delayInfo'].validate((valid, obj) => {
        if (valid) {
          let sendData = JSON.parse(JSON.stringify(this.delayInfo))
          this.$ajax({
            method: 'POST',
            url: 'baseInfo/courseInfo/delayClass',
            data: sendData
          })
            .then(res => {
              if (res.data.code > 0) {
                this.delayVisable = false
                this.$message.success('操作成功！')
                this.getTableData()
              } else {
                this.$message.error(res.data.desc)
              }
            })
            .catch(err => console.log(err))
        } else {
          this.$message.error('请检查表单输入！')
        }
      })
    },
    cancelDelay() {
      this.delayInfo.delayStartDate = null
      this.delayInfo.delayEndDate = null
      this.delayInfo.delayClosingUpDate = null
      this.delayVisable = false
      this.$refs['delayInfo'].clearValidate()
    },
    // 表单验证 日期逻辑
    checkStartDate(rule, value, callback) {
      let sd = this.delayInfo.delayStartDate
      let ed = this.delayInfo.delayEndDate
      if (sd && ed && new Date(sd).getTime() >= new Date(ed).getTime()) {
        callback(new Error('开班日期晚于结业日期，请重新输入。'))
      } else {
        callback()
      }
    },
    // 表单验证 日期逻辑
    checkSignUpDate(rule, value, callback) {
      let ed = this.delayInfo.delayEndDate
      let sued = this.delayInfo.delayClosingUpDate
      if (sued && ed && new Date(sued).getTime() >= new Date(ed).getTime()) {
        callback(new Error('截止报名日期晚于结业日期，请重新输入。'))
      } else {
        callback()
      }
    },
    // 表单验证 日期逻辑
    checkDateLogic(rule, value, callback) {
      let sd = this.delayInfo.delayStartDate
      let ed = this.delayInfo.delayEndDate
      let sued = this.delayInfo.delayClosingUpDate
      if ((sd && ed) || (sued && ed)) {
        if (sd && new Date(sd).getTime() >= new Date(ed).getTime()) {
          callback(new Error('开班日期晚于结业日期，请重新输入。'))
        } else if (sued && new Date(sued).getTime() >= new Date(ed).getTime()) {
          callback(new Error('截止报名日期于结业日期，请重新输入。'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    // 状态值渲染
    getStatusLabel(v) {
      return this.sLabels[parseInt(v)] || ''
    },
    // 1.关闭的时候如果已经有人预报名可以直接关闭，在关闭页面人数显示不显示都可以
    //   2.关闭的时候如果已经有人缴费，就先跳到注销退费，退费完成后可以关闭
    // 关闭
    // 提审
    // 撤销
    changeStatus(row, s) {
      let sendData = { id: row.id }
      if (s === 2) {
        sendData.isClose = 0
        if (row.preStudentInfoList.length > 0 || row.payStudentInfoList.length > 0) {
          this.$message.info('缴费人数和报名人数不为0！不可关闭！')
          return false
        }
      } else {
        sendData.status = s
      }
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/courseInfo/updateStatus',
        data: sendData
      })
        .then(res => {
          if (res.data.code > 0) {
            this.$message.success('操作成功！')
            this.getTableData()
          } else {
            this.$message.error(res.data.desc)
          }
        })
        .catch(err => console.log(err))
    },
    // 编辑
    edit(row) {
      // 最低排课人数 校验
      if (row.payStudentInfoList.length >= row.classInfo.minimumNumber) {
        sessionStorage.removeItem('classCode')
        sessionStorage.setItem('classCode', JSON.stringify(row.classInfo.classCode))
        sessionStorage.removeItem('classId')
        sessionStorage.setItem('classId', JSON.stringify(row.classId))
        sessionStorage.removeItem('isClose')
        sessionStorage.setItem('isClose', JSON.stringify(this.inhand))
        this.$router.push('/startClass/detail/' + row.id)
      } else {
        this.$message.error('缴费人数低于最低排课人数，不可以排课！')
      }
    },
    getLockTime(stime) {
      let useTime = (new Date().getTime() - stime) / 1000
      const totleTime = 48 * 60 * 60
      if (totleTime < useTime) {
        return ''
      }
      return '剩余时间：' + simpleCount(totleTime - useTime)
    },
    // 按钮状态
    getBtnSt(v) {
      v = v && parseInt(v)
      let sts = {
        editDis: false,
        editShow: true,
        subDis: false,
        subShow: true,
        cancelDis: false,
        cancelShow: true,
        closeDis: false,
        closeShow: true
      }
      // 状态（0 草稿 1 审批中 2 通过 3 驳回 null 刚开班审批过来的 4延期审批中 5延期通过  6 延期驳回）
      switch (v) {
        case 0:
          sts.cancelShow = false
          break
        case 1:
          sts.subShow = false
          sts.editDis = true
          sts.closeDis = true
          break
        case 2:
          sts.subShow = false
          sts.editDis = true
          sts.cancelDis = true
          break
        case 3:
          sts.cancelShow = false
          break
        case 4:
          sts.cancelShow = false
          sts.editDis = true
          sts.subDis = true
          break
        default:
          sts.cancelShow = false
          sts.subDis = true
      }
      return sts
    },
    // 抛出学生列表
    getStuList(idx, row, type) {
      this.tempRow = {
        idx, type
      }
      this.dialogBaseInfo = {
        row: row,
        title: row.classInfo.classCode + row.classInfo.specialtyName,
        from: type
      }
      if (type === 'signup') {
        this.dialogTableData = row.preStudentInfoList
        this.dialogBaseInfo.title += '预报名人员'
      } else {
        this.dialogTableData = row.payStudentInfoList
        this.dialogBaseInfo.title += '缴费人员'
      }
      this.dialogVisable = true
    },
    // 确认
    confirmSigup(row) {
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/classStudent/updateClassStudentMapping',
        data: {
          id: row.classStudentId,
          isConfirm: row.isConfirm
        }
      })
        .then(res => {
          if (res.data.code > 0) {
            this.getTableData()
          } else {
            this.$message.error(res.data.desc)
          }
        })
        .catch(err => console.log(err))
    },
    // 查看审批流水
    showApprovFlow(row) {
      this.$ajax({
        method: 'post',
        url: 'baseInfo/applyformController/getApplyformDetail',
        data: {
          'applyformId': row.applyformId,
          'specialtyId': row.classInfo.specialty
        }
      }).then(res => {
        if (res.data.code === 1) {
          this.ApprovalFlowData = res.data.data.processConfs
          this.dialogApprovalFlow = true
        } else {
          this.$message.error(res.data.desc)
        }
      })
    },
    // 查看驳回意见
    showDismissal(row) {
      this.currentRow = row
      this.dismissalVisable = true
    }
  },
  created() {
    this.getTableData()
  }
}
