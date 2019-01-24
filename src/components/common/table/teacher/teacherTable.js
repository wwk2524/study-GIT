
export default {
    props: {
      tableData: {
        type: Array,
        required: true
      },
      cols: {
        type: Array
      },
      clear: {
        type: Boolean,
        required: true
      }
    },
    watch: {
      clear(nv) {
        this.$refs['teachertable'].clearSelection()
      }
    },
    data() {
      return {
          column: this.cols && this.cols.length ? this.cols : [{label:'教师名', prop:'teacherName'}]
      }
    },
    methods: {
      selectChange(rows) {
        this.$emit('selectChange', rows)
      }
    }
  }
  