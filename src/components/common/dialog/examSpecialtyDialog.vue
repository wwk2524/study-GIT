<template>
  <div>
    <!-- 添加教室 -->
      <el-dialog title='添加工种' :visible.sync="specialtyDialog" width="50%"  @close="$emit('update:show', false)">
        <el-row>
            <el-col :span=16>
                <el-input placeholder="监考员" v-model="query" clearable></el-input>
            </el-col>
            <el-col :span=8 class='text-right'>
                <el-button size="small" type="primary" @click="selectBtn()">查询</el-button>
                <el-button size="small" type="primary" @click="resetBtn()">重置</el-button>
            </el-col>
        </el-row>
        <el-table :data="specialtyData" border class='mt30' stripe highlight-current-row @current-change="handleCurrentSpecialtyChange">
            <el-table-column align="left" label="工种编号" prop="specialtyCode" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="left" label="工种名称" prop="specialtyName" show-overflow-tooltip sortable></el-table-column>
        </el-table>
        <!-- page divide -->
        <div class="ins-tab-divide  text-center mt20">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="sizeArr" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="specialtyDialog=false">取消</el-button>
            <el-button type="primary" size="small" @click='submitSpecialty'>确定</el-button>
        </span>
      </el-dialog>
  </div>
</template>
<style scoped>

</style>
<script>
export default{
  props: {
    curRow: {
      type: Object,
      required: true
    },
    show: {
      type: Boolean,
      default: false
    },
    chooseClass: {
      type: Array
    }
  },
  watch: {
    show () {
      this.specialtyDialog = this.show
    },
    curRow (val) {
      this.curRow = val
    }
  },
  data () {
    return {
      query: '',
      total: 1, // 数据总条数
      size: 10, // 每页数据条数
      currentPage: 1, // 当前页数
      sizeArr: [10, 20, 50],
      specialtyDialog: this.show,
      chooseAddSpecialty: null,
      specialtyData: [],
      isAll: false
    }
  },
  mounted () {
  },
  methods: {
    getSpecialty () {
      this.chooseAddSpecialty = null
      let params = {
        'query': this.query,
        'pageNum': this.currentPage,
        'pageSize': this.size
      }
      this.$ajax({
        method: 'post',
        url: 'baseInfo/examineBase/getExamineSpecialties',
        data: params
      }).then(res => {
        if (res.data.code === 1) {
          this.specialtyData = res.data.list
          this.total = res.data.recordCount
        } else {
          this.$message.error(res.data.desc)
        }
      })
    },
    selectBtn () {
      this.getSpecialty()
    },
    resetBtn () {
      this.query = ''
      this.getSpecialty()
    },
    handleCurrentSpecialtyChange (val) {
      this.chooseAddSpecialty = val
    },
    handleSizeChange (val) {
      this.size = val
      this.chooseSpecialtyOper()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.chooseSpecialtyOper()
    },
    submitSpecialty () {
      this.$emit('submitSpecialty', this.chooseAddSpecialty, this.curRow)
    }
  }
}
</script>

