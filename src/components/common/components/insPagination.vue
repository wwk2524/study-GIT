<template>
<div>
<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10,50, 100, 200, 300]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total">
</el-pagination>
</div>
</template>
<script>
export default {
  props: {
    copydata: {
      type: Array,
      default: [],
      required: true
    }
  },
  data () {
    return {
      tableData: [],
      currentPage: 1,
      total: 0,
      size: 50
    }
  },
  mounted () {
    // 进页面默认执行方法
    var _this = this
    setTimeout(function () {
      _this.total = _this.copydata.length
    }, 300)
  },
  watch: {
    copydata: function () {
      this.total = this.copydata.length
    }
  },
  methods: {
    handleSizeChange (val) {
      // 分页的上一页下一页
      this.size = val
      this.handleCurrentChange(1)
    },
    handleCurrentChange (val) {
      //  分页的跳到当前页面
      this.currentPage = val || this.currentPage
      this.tableData = this.copydata.slice(
        (this.currentPage - 1) * this.size,
        this.currentPage * this.size
      )
      this.$emit('refresh', this.tableData)
    }

  }
}
</script>

