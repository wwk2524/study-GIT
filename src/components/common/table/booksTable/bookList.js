export default {
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data () {
    return {
      query: {
        size: 10,
        page: 1,
        query: null
      },
      total: 0,
      sizeArr: [10, 20, 50],
      tableData: [],
      selections: [],
      showDialog: false
    }
  },
  watch: {
    dialogVisible (nv, ov) {
      this.showDialog = nv
      this.selections = []
      this.toggleSelection()
    }
  },
  methods: {
    getTableData () {
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/textbook/queryTextBooks',
        data: { 'query': this.query.query, 'pageSize': this.query.size, 'pageNum': this.query.page }
      }).then(res => {
        if (res.data.code > 0) {
          this.tableData = res.data.list
          this.total = res.data.recordCount
        } else {
          this.$message.error(res.data.desc)
        }
      })
        .catch(err => console.log(err))
    },
    resetSearch () {
      this.query.query = null
      this.page = 1
      this.getTableData()
    },
    getSelections (items) {
      this.selections = items
    },
    ensureAdd () {
      this.$emit('ensure', JSON.parse(JSON.stringify(this.selections)))
    },
    cancel () {
      this.$emit('cancel')
    },
    toggleSelection () {
      if (this.$refs.bookListTable !== undefined && this.$refs.bookListTable.clearSelection) {
        this.$refs.bookListTable.clearSelection()
      }
    },
    pageChange (np) {
      this.query.page = np
      this.getTableData()
    },
    sizeChange (s) {
      this.query.size = s
      this.getTableData()
    }
  },
  created () {
    this.getTableData()
  }
}
