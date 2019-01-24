<template>
  <div>
    <!-- 添加教室 -->
      <el-dialog title='匹配教室' :visible.sync="classDialog" width="50%"  @close="$emit('update:show', false)">
        <el-select v-model="classType" multiple collapse-tags style="width:140px;" placeholder="请选择(可多选)" @change='changeClassType'>
            <el-option v-for="item in classTypeOptions" :key="item.value" :label="item.label" :value="item.label">
            </el-option>
        </el-select>
        <el-checkbox v-model="isAll" @change='changeIsAll'>查看全部候选教室</el-checkbox>
        <el-table :data="classDataCopy" border class='mt30' stripe highlight-current-row @current-change="handleCurrentClassChange">
            <el-table-column align="left" label="教室名称" prop="classroomCode" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="left" label="教室类型" prop="classroomTypeName" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="left" label="考务容纳人数" prop="examinationNumber" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="left" label="已安排考试时间（类型）" prop="hasPlaned" width='250px' show-overflow-tooltip sortable>
                <template slot-scope="scope">
                    <div v-for='(item,index) in scope.row.hasPlanedArr' :key='index'>
                        {{$api.getDateAll(item.startDate).slice(5)}}{{$api.getDateAll(item.startDate,'-','onlyhm')}}-{{$api.getDateAll(item.endDate,'-','onlyhm')}}({{item.type}})
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
      classType: [],
      classTypeOptions: [],
      examTypeValue: ['', '理论', '实操', '论文答辩'],
      classDialog: this.show,
      chooseAddClass: null,
      classData: {},
      classDataCopy: [],
      schoolArea: null,
      isAll: false
    }
  },
  mounted () {
    this.schoolArea = parseInt(this.$route.query.schoolAreaId)
  },
  methods: {
    chooseClassOper () {
      this.classTypeOptions = []
      this.chooseAddClass = null
      let params = {
        'id': this.curRow.id.toString(),
        'schoolArea': this.schoolArea,
        'isAll': this.isAll ? '1' : '0'
      }
      this.$ajax({
        method: 'post',
        url: 'baseInfo/examine/getAvailablePraticeExamClassRooms',
        data: params
      }).then(res => {
        if (res.data.code === 1) {
          this.classData = res.data.data
          let i = 0
          let arr = []
          for (let key in res.data.data) {
            let a = {
              value: i++,
              label: key
            }
            this.classTypeOptions.push(a)
          }
          for (let i = 0; i < Object.values(res.data.data).length; i++) {
            arr = arr.concat(Object.values(res.data.data)[i])
          }
          this.resetData(arr)
          this.classDialog = true
        } else {
          this.$message.error(res.data.desc)
        }
      })
    },
    resetData (arr) {
      arr.forEach(item => {
        item.newDetail = ''
        if (item.practiceExamDetail !== null && item.examDetail !== null) {
          item.newDetail = item.practiceExamDetail + ',' + item.examDetail
        } else if (item.practiceExamDetail !== null) {
          item.newDetail = item.practiceExamDetail
        } else {
          item.newDetail = item.examDetail
        }
        item.hasPlanedArr = []
        if (item.newDetail) {
          let arr1 = item.newDetail.split(',')
          for (let i = 0; i < arr1.length; i++) {
            let arr2 = arr1[i].split('|')
            let a = {
              startDate: parseInt(arr2[0]),
              endDate: parseInt(arr2[1]),
              type: arr2[2]
            }
            item.hasPlanedArr.push(a)
          }
        }
      })
      this.classDataCopy = arr
    },
    changeClassType () {
      let arr = []
      if (this.classType.length !== 0) {
        for (let i = 0; i < this.classType.length; i++) {
          for (let key in this.classData) {
            if (this.classType[i] === key) {
              this.classData[key].forEach(item => {
                arr.push(item)
              })
            }
          }
        }
      } else {
        for (let i = 0; i < Object.values(this.classData).length; i++) {
          arr = arr.concat(Object.values(this.classData)[i])
        }
      }
      this.resetData(arr)
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
          'classroom': this.chooseAddClass.classId,
          'id': this.curRow.id
        }
        this.$ajax({
          method: 'post',
          url: 'baseInfo/examine/handOnPraticeExamClassRoom',
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

