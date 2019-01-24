let weekLabels = { '1': '周一', '2': '周二', '3': '周三', '4': '周四', '5': '周五', '6': '周六', '0': '周日' }

export default {
  props: {
    isEdit: {
      type: Boolean,
      default: true
    },
    courseInfoId: {
      type: [String, Number],
      required: true
    },
    reload: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableData: [],
      currentRow: {},
      lessonDialog: false
    }
  },
  watch: {
    courseInfoId(nv, ov) {
      if (nv) {
        this.getTableData(nv)
      }
    },
    reload () {
      this.getTableData(this.courseInfoId)
    }
  },
  created() {
    this.getTableData(this.courseInfoId)
  },
  methods: {
    getTableData(courseInfoId) {
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/courseInfo/findCourseDetaiList',
        data: {
          courseInfoId: courseInfoId
        }
      })
        .then(res => {
          if (res.data.code > 0) {
            this.tableData = res.data.list
            let courseIds1 = []
            let courseIds2 = []
            this.tableData.map(li => {
              if (li && li.courseDetails) {
                let liIds = li.courseDetails.map(c => {
                  return c.id
                })
                li.courseType === '1' ? courseIds1.push(...liIds) : courseIds2.push(...liIds)
              }
            })
            this.$api.debugConsole('课表信息 课表实操课时ID列表：', JSON.stringify(courseIds1))
            this.$api.debugConsole('课表信息 课表实理论时ID列表：', JSON.stringify(courseIds2))
          } else {
            this.$message.error(res.data.desc)
          }
        })
        .catch(err => console.log(err))
    },
    showLessonTip(row) {
      this.currentRow = JSON.parse(JSON.stringify(row.courseDetails[0]))
      this.lessonDialog = true
    },
    cancelSave() {
      this.currentRow = {}
      this.lessonDialog = false
    },
    saveLessonTip() {
      this.$refs['currentRow'].validate((valid, obj) => {
        if (valid) {
          this.$ajax({
            method: 'POST',
            url: 'baseInfo/courseInfo/updateCoursesContent',
            data: {
              id: this.currentRow.id,
              coursesContent: this.currentRow.coursesContent
            }
          })
            .then(res => {
              if (res.data.code > 0) {
                this.lessonDialog = false
                this.getTableData(this.courseInfoId)
              } else {
                this.$message.error(res.data.desc)
              }
            })
            .catch(err => console.log(err))

        } else {
          this.$message.error('请检查输入情况！')
          return false
        }
      })

    },
    parseTime(s, e) {
      return {
        dayNa: this.$api.getDateAll(s, '/') + '(' + weekLabels[new Date(s).getDay()] + ')',
        sAndE: this.$api.getDateAll(s, null, 'onlyhm') + '-' + this.$api.getDateAll(e, null, 'onlyhm')
      }
    }
  }
}
