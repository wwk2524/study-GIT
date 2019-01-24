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
    specialty: {
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
  },
  methods: {
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
                  // (this.chargesInfo)
                })
    }
  },
  created () {
    if (this.specialty && this.courseInfoId) {
      this.insetPrice()
    }
  }
}
