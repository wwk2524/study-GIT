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
    classId: {
      type: [Number, String],
      required: true
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
        'studentNum': 0,
        'signupCourseCharges': [],
        'signupOtherCharges': [],
        'signupTextbookCharges': []
      },
      chargesInfoRules: {},
      teacherList: []
    }
  },
  methods: {
    // 求和 单价*课时数量 累加
    addUpEvery (arr, t) {
      let result
      if (t) {
        result = arr.reduceRight((prev, cur, index, array) => {
          return cur.courseType === t ? prev + parseFloat(cur.chargesPrice * cur.classPeriod) : prev
        }, 0)
      } else {
        result = arr.reduceRight((prev, cur, index, array) => {
          return prev + parseFloat(cur.chargesPrice * cur.classPeriod)
        }, 0)
      }
      return result
    },

    //     // 其他费用增加一项
    plusElseListItem () {
      this.chargesInfo.signupOtherCharges.push({ 'chargesName': null, 'chargesPrice': 0 })
    },
    //     // 其他费用删除一项
    removeListItem (idx) {
      this.chargesInfo.signupOtherCharges.splice(idx, 1)
    },
    //     // 提交修改后的费用
    submit () {
      this.$refs['chargesInfo'].validate((valid, obj) => {
        if (valid) {
          const cId = this.chargesInfo.classId
          const cInfoId = this.chargesInfo.courseInfoId
          let sendData = {
            'classId': this.chargesInfo.classId,
            'courseInfoId': this.chargesInfo.courseInfoId,
            'tuition': this.chargesInfo.tuition,
            'studentNum': this.chargesInfo.studentNum
          }
          sendData.signupCourseCharges = this.chargesInfo.signupCourseCharges.map(item => {
            return {
              id: item.id || null,
              'classId': cId,
              'courseInfoId': cInfoId,
              'courseType': item.courseType,
              'teacherId': item.teacherId,
              'teacherName': item.teacherName,
              'chargesPrice': item.chargesPrice
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
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/generaltableAction/findTrainBalanceListByClassId',
        data: { classId: this.classId }
      })
        .then(res => {
          if (res.data.code > 0) {
            this.chargesInfo = res.data.data
          } else {
            this.$message.error(res.data.desc)
          }
        })
        .catch(err => console.log(err))
    },
    addUpLessonPrice (arr, courseType) {
      if (!arr || !arr.length) return 0
      return arr.reduceRight((prev, cur, index, array) => {
        let cType = parseInt(cur.courseType)
        let curVal = 0
        if (courseType !== 0) {
          curVal = cType === courseType && parseInt(cur.teacherType) === 1 ? cur.classPeriod * cur.chargesPrice : 0
        } else {
          curVal = parseInt(cur.teacherType) === 2 ? cur.classPeriod * cur.chargesPrice : 0
        }
        return prev + curVal
      }, 0)
    },
    addUpLessonType (arr, courseType) {
      if (!arr || !arr.length) return 0
      return arr.reduceRight((prev, cur, index, array) => {
        let cType = parseInt(cur.courseType)
        let curVal = 0
        if (courseType !== 0) {
          curVal = cType === courseType && parseInt(cur.teacherType) === 1 ? cur.classPeriod : 0
        } else {
          curVal = parseInt(cur.teacherType) === 2 ? cur.classPeriod : 0
        }
        return prev + curVal
      }, 0)
    }
  },
  created () {
    this.findCourseCharges()
  }
}
