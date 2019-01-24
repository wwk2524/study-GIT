import iconBtnGroup from '@/components/common/button/iconBtnGroup.vue'
function getValueById (arr, idNa, idVa, vaNa) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][idNa] === idVa) {
      return arr[i][vaNa]
      break
    }
  }
  return null
}
export default {
  props: {
    courseInfoId: {
      type: [Number, String],
      required: true
    },
    isEdit: {
      type: Boolean,
      default: true
    },
    specialty: {
      required: true
    },
    reload: {
      type: Boolean,
      default: false
    }
  },
  components: {
    iconBtnGroup
  },
  data () {
    return {
      chargesInfo: {
        'classId': null,
        'courseInfoId': null,
        'tuition': 0,
        'costNumber': 0,
        'quotaNumber': 0,
        'signupCourseCharges': [],
        'signupOtherCharges': [],
        'signupTextbookCharges': []
      },
      chargesInfoRules: {},
      teacherList: []
    }
  },
  watch: {
    specialty (nv, ov) {
      this.insetPrice()
    },
    courseInfoId (nv, ov) {
      this.insetPrice()
    },
    needReload () {
      this.insetPrice()
    }
  },
  methods: {
        // 求和 单价*课时数量 累加
    addUpEvery (arr, t) {
      let result
      if (t) {
        result = arr.reduceRight((prev, cur, index, array) => {
          return cur.courseType === t ? prev + parseFloat(cur.lessonPrice * cur.classPeriod) : prev
        }, 0)
      } else {
        result = arr.reduceRight((prev, cur, index, array) => {
          return prev + parseFloat(cur.lessonPrice * cur.classPeriod)
        }, 0)
      }
      return result
    },

        // 其他费用增加一项
    plusElseListItem () {
      this.chargesInfo.signupOtherCharges.push({ 'chargesName': null, 'chargesPrice': 0 })
    },
        // 其他费用删除一项
    removeListItem (idx) {
      this.chargesInfo.signupOtherCharges.splice(idx, 1)
    },
        // 提交修改后的费用
    submit () {
      this.$refs['chargesInfo'].validate((valid, obj) => {
        if (valid) {
          const cId = this.chargesInfo.classId
          const cInfoId = this.chargesInfo.courseInfoId
          let sendData = {
            'classId': this.chargesInfo.classId,
            'courseInfoId': this.chargesInfo.courseInfoId,
            'tuition': this.chargesInfo.tuition,
            'costNumber': this.chargesInfo.costNumber
                        // "quotaNumber": this.chargesInfo.quotaNumber,
          }
          sendData.signupCourseCharges = this.chargesInfo.signupCourseCharges.map(item => {
            return {
              id: item.id || null,
              'classId': cId,
              'courseInfoId': cInfoId,
              'courseType': item.courseType,
              'teacherId': item.teacherId,
              'teacherName': item.teacherName,
              'chargesPrice': item.lessonPrice
            }
          })
          sendData.signupOtherCharges = this.chargesInfo.signupOtherCharges.map(item => {
            return {
              id: item.id || null,
              'classId': cId,
              'courseInfoId': cInfoId,
              chargesName: item.chargesName,
              chargesPrice: item.chargesPrice
            }
          })

          this.$ajax({
            method: 'POST',
            url: 'baseInfo/courseInfo/saveCourseCharges',
            data: sendData
          })
                        .then(res => {
                          if (res.data.code > 0) {
                            this.$message.success('操作成功！')
                          } else {
                            this.$message.error(res.data.desc)
                          }
                        })
                        .catch(err => console.log(err))
        } else {
          this.$message.error('请检查预算信息是否输入正确')
        }
      })
    },
        // 费用信息查询
    findCourseCharges () {
      return this.$ajax({
        method: 'POST',
        url: 'baseInfo/courseInfo/findCourseCharges',
        data: {
          courseInfoId: this.courseInfoId
        }
      })
                .then(res => {
                  if (res.data.code > 0) {
                    return res.data.data
                  } else {
                    this.$message.error(res.data.desc)
                    return false
                  }
                })
                .catch(err => console.log(err))
    },
        // 费用信息查询
    getTeachersCharge () {
      return this.$ajax({
        method: 'GET',
        url: 'baseInfo/parameter/getSpecialtyTeacher/' + this.specialty,
        data: null
      })
                .then(res => {
                  if (res.data.code > 0) {
                    return res.data.list
                  } else {
                    this.$message.error(res.data.desc)
                    return false
                  }
                })
                .catch(err => console.log(err))
    },
    insetPrice () {
      Promise.all([this.findCourseCharges(), this.getTeachersCharge()])
                .then(resultList => {
                  this.chargesInfo = resultList[0]
                  this.teacherList = resultList[1]
                  if (!this.chargesInfo || !this.teacherList) { return false }
                  this.chargesInfo.signupCourseCharges.map(t => {
                    let price = getValueById(this.teacherList, 'teacherId', t.teacherId, 'wages')
                    if (price !== null) {
                      t.lessonPrice = price
                    } else {
                      t.lessonPrice = 0
                      console.error('没有找到价格，请检查逻辑！')
                    }
                  })
                })
    }
  },
  created () {
    if (this.specialty && this.courseInfoId) {
      this.insetPrice()
    }
  }
}
