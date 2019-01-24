export default {
  data () {
    return {
      // 页码相关
      total: 1, // 数据总条数
      size: 20, // 每页数据条数
      sizeArr: [20, 50, 100],
      currentPage: 1, // 当前页数
      query: '',
      tableData: []
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
        url: 'baseInfo/classStudent/getHasRegistedStudents',
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
    selectInfo (row) {
      let item = {
        classTypeValueName: row.category,
        workTypeValueName: row.specialty,
        className: row.classCode
      }
      sessionStorage.removeItem('signUpClassOwn')
      sessionStorage.setItem('signUpClassOwn', JSON.stringify(item))
      let params = decodeURIComponent('studentId=' + row.studentId + '&classId=' + row.classId + '&specialtyId=' + row.specialtyId + '&categoryId=' + row.categoryId + '&csId=' + row.classStudentId + '&select=1' + '&invoiceNum=' + row.invoiceNum + '&isPrintInvoice=' + row.isPrintInvoice)
      this.$router.push({
        path: '/signUp/addStudent?' + params
      })
    },
    exportRegister () {
      this.$ajax({
        method: 'post',
        url: 'baseInfo/classStudent/exportHasRegistedStudents',
        data: {
          query: this.query
        },
        responseType: 'blob'
      }).then(res => {
        console.log(res)
        const content = res.data
        const blob = new Blob([content])
        console.log(blob)
        const fileName = '已登记学生列表.xls'
        if ('download' in document.createElement('a')) { // 非IE下载
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        }
      })
    }
  }
}
