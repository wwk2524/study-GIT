<template>
  <div>
    <!-- 添加教室 -->
      <el-dialog title='匹配教室' :visible.sync="classDialog" width="50%"  @close="$emit('update:show', false)">
        <el-checkbox v-model="isAll" @change='changeIsAll'>查看全部候选教室</el-checkbox>
        <el-table :data="classData" border class='mt30' stripe highlight-current-row @current-change="handleCurrentClassChange">
            <el-table-column align="left" label="教室名称" prop="classroomCode" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="left" label="教室类型" prop="classroomType" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="left" label="考务容纳人数" prop="examinationNumber" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="left" label="已安排考试时间（类型）" prop="hasPlaned" width='250px' show-overflow-tooltip sortable>
                <template slot-scope="scope">
                    <div v-for='(item,index) in scope.row.hasPlanedArr' :key='index'>
                        {{$api.getDateAll(item.startDate).slice(5)}}{{$api.getDateAll(item.startDate,'-','onlyhm')}}-{{$api.getDateAll(item.endDate,'-','onlyhm')}}({{examTypeValue[item.type]}})
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="classDialog=false">取消</el-button>
            <el-button type="primary" size="small" @click="submit">确定</el-button>
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
      this.classDialog = this.show
    },
    curRow (val) {
      this.curRow = val
    }
  },
  data () {
    return {
      examTypeValue: ['', '理论', '实操', '论文答辩'],
      classDialog: this.show,
      chooseAddClass: null,
      classData: [],
      isAll: false
    }
  },
  mounted () {
  },
  methods: {
    chooseClassOper () {
      this.chooseAddClass = null
      let params = {
        'classroomIds': this.chooseClass,
        'examSectionId': this.curRow.id.toString(),
        'isAll': this.isAll ? '1' : '0'
      }
      this.$ajax({
        method: 'post',
        url: 'baseInfo/examine/getAvailableClassrooms',
        data: params
      }).then(res => {
        if (res.data.code === 1) {
          res.data.list.forEach(item => {
            item.hasPlanedArr = []
            if (item.hasPlaned) {
              let arr1 = item.hasPlaned.split(',')
              for (let i = 0; i < arr1.length; i++) {
                let arr2 = arr1[i].split('|')
                let a = {
                  startDate: parseInt(arr2[0]),
                  endDate: parseInt(arr2[1]),
                  type: parseInt(arr2[2])
                }
                item.hasPlanedArr.push(a)
              }
            }
          })
          this.classData = res.data.list
          this.classDialog = true
        } else {
          this.$message.error(res.data.desc)
        }
      })
    },
    changeIsAll () {
      this.chooseClassOper(this.curRow)
    },
    handleCurrentClassChange (val) {
      this.chooseAddClass = val
    },
    submit () {
      // debugger
      if (this.chooseAddClass === null) {
        this.$message.warning('请先选择教室')
        return false
      }
      this.$confirm('确定提交吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let params = {
          'classroomId': this.chooseAddClass.classroomId,
          'examSectionId': this.curRow.id
        }
        this.$ajax({
          method: 'post',
          url: 'baseInfo/examine/handArrangeClassroom',
          data: params
        }).then(res => {
          if (res.data.code === 1) {
            this.$emit('getData')
            this.$message.success('安排成功')
            this.classDialog = false
          } else {
            this.$message.error(res.data.desc)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    }
  }
}
</script>

