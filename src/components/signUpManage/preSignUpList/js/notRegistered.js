export default{
  data () {
    return {
      // 页码相关
      total: 1, // 数据总条数
      size: 20, // 每页数据条数
      sizeArr: [20, 50, 100],
      currentPage: 1, // 当前页数
      query: '',
      tableData: [],
      copyData: [],
      scrColumn: {
        studentName: {text: '学生姓名', selected: true, field: 'studentName'},
        classCode: {text: '班级代码', selected: true, field: 'classCode'},
        studentPhone: {text: '手机号码', selected: true, field: 'studentPhone'},
        studentIdCard: {text: '身份证号', selected: true, field: 'studentIdCard'},
        isConfirm: {text: '是否确认', selected: true, field: 'isConfirm'}
      }
    }
  },
  mounted () {
    this.getTable()
  },
  methods: {
    // 每页数据条数改变
    handleSizeChange (val) {
      this.size = val
      this.getTable()
    },
    // 当前页面改变
    handleCurrentChange (val) {
      this.currentPage = val
      this.getTable()
    },
    getTable () {
      let params = {
        'pageNum': this.currentPage,
        'pageSize': this.size,
        'query': this.query
      }
      this.$ajax({
        method: 'post',
        url: 'baseInfo/classStudent/getPredictionStudent',
        data: params
      }).then(res => {
        if (res.data.code === 1) {
          this.tableData = res.data.list
          this.tableData.forEach(item => {
            if (item.isConfirm === '0' || item.isConfirm === null) {
              item.isConfirm = false
            } else {
              item.isConfirm = true
            }
          })
          this.total = res.data.recordCount
        } else {
          this.$message.error(res.data.desc)
        }
      })
    },
    // 查询
    frontFilter () {
      this.getTable()
    },
    // 重置
    resetSearch () {
      this.query = ''
      this.getTable()
    },
    // 新增学生
    addStudent () {
      this.$router.push({
        path: '/signUp/addStudent'
      })
    },
    // 删除学生
    delStudent (row) {
      this.$confirm('删除后，将删除该学生此次报名的班级信息！?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$ajax({
          method: 'get',
          url: 'baseInfo/classStudent/deletePredictionStudent/' + row.classStudentId
        }).then((res) => {
          if (res.data.code === 1) {
            this.getTable()
            this.$message.success('删除成功')
          } else {
            this.$message.error(res.data.desc)
          }
        })
      }).catch(() => {
        this.$message('已取消删除')
      })
    },
    // 是否确认
    changeSwitch (row) {
      this.$confirm('确定改变当前状态', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$ajax({
          method: 'post',
          url: 'baseInfo/classStudent/updateClassStudentMapping',
          data: {'id': row.classStudentId, 'isConfirm': (Number(row.isConfirm)).toString()}
        }).then(res => {
          if (res.data.code === 1) {
            this.$message.success('修改成功!')
            this.getTable()
          } else {
            this.$message.error(res.data.desc)
          }
        })
      }).catch(() => {
        this.getTable()
        this.$message({
          type: 'info',
          message: '已取消修改'
        })
      })
    },
    // 填写报名信息
    updateInfo (row) {
      sessionStorage.removeItem('preSignUpStudent')
      sessionStorage.setItem('preSignUpStudent', Number(row.isConfirm))
      this.$router.push({
        path: '/signUp/addStudent?studentId=' + row.studentId + '&classId=' + row.classId + '&specialtyId=' + row.specialtyId + '&categoryId=' + row.categoryId + '&csId=' + row.classStudentId
      })
    }
  }
}
