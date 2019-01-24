<template>
  <div>
    <el-dialog title='监考员' :visible.sync="teacherDialog" width="70%" @close="$emit('update:show', false);chooseTeacher=[];chooseTeacherCopy=[]">
            <el-row>
                <el-col :span=16>
                    <el-input placeholder="监考员" v-model="query" clearable></el-input>
                </el-col>
                <el-col :span=8 class='text-right'>
                    <el-button size="small" type="primary" @click="selectBtn">查询</el-button>
                    <el-button size="small" type="primary" @click="resetBtn">重置</el-button>
                </el-col>
            </el-row>
            <el-table ref='multipleTable' class='examTeacherData mt30' :data="teacherData" border stripe @select='handleCurrentTeacher'>
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column align="left" label="姓名" prop="teacherName" show-overflow-tooltip sortable></el-table-column>
                <el-table-column align="left" label="性别" prop="teacherSex" show-overflow-tooltip sortable>
                    <template slot-scope="scope">
                        <div>{{scope.row.sex==='0' ? '女' : '男'}}</div>
                    </template>
                </el-table-column>
                <el-table-column align="left" label="存在黑名单" prop="inBlackList" show-overflow-tooltip sortable>
                  <template slot-scope="scope">
                        <div>
                            <el-switch :value="scope.row.inBlackList==='1'" @input="inputIsOut($event,scope.row,1)"></el-switch>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="left" label="是否新手" prop="isNew" show-overflow-tooltip sortable>
                    <template slot-scope="scope">
                        <div>
                            <el-switch :value="scope.row.isNew==='1'" @input="inputIsOut($event,scope.row,2)"></el-switch>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="left" label="报名时间" prop="signUpDate" width='200px' show-overflow-tooltip sortable>
                    <template slot-scope="scope">
                        <div v-for='(item,index) in scope.row.signUpDateArr' :key='index'>{{item}}</div>
                    </template>
                </el-table-column>
                <el-table-column align="left" label="教室（已安排时间）" prop="detail" width='350px' show-overflow-tooltip sortable>
                    <template slot-scope="scope">
                        <div v-for='(item,index) in scope.row.detailArr' :key='index'>
                            {{item.type}}({{$api.getDateAll(item.startDate,'/','hm')}}-{{$api.getDateAll(item.endDate,'/','hm')}})
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <!-- page divide -->
            <div class="ins-tab-divide  text-center mt20">
                <el-pagination @size-change="handleTeacherSizeChange" @current-change="handleTeacherCurrentChange" :current-page="currentPageTeacher" :page-sizes="sizeArrTeacher" :page-size="sizeTeacher" layout="total, sizes, prev, pager, next, jumper" :total="totalTeacher">
                </el-pagination>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="teacherDialog=false">取消</el-button>
                <el-button type="primary" size="small" @click="addTeacher">确定</el-button>
            </span>
        </el-dialog>
  </div>
</template>
<style scoped>
    .examTeacherData {
        max-height: 460px;
        overflow: auto;
    }
</style>
<style>
    .examTeacherData .el-table__header .el-checkbox__inner {
        display: none;
    }
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
    examType: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      teacherDialog: this.show,
      query: '',
      totalTeacher: 1, // 数据总条数
      sizeTeacher: 10, // 每页数据条数
      currentPageTeacher: 1, // 当前页数
      sizeArrTeacher: [10, 20, 50],
      currRowTeacher: {},
      teacherData: [],
      chooseTeacher: [],
      chooseTeacherCopy: [],
      schoolAreaId: null
    }
  },
  watch: {
    show () {
      this.teacherDialog = this.show
    },
    curRow (val) {
      this.curRow = val
    }
  },
  mounted () {
    this.schoolAreaId = this.$route.query.schoolAreaId
  },
  methods: {
    checked () {
      this.chooseTeacherCopy.forEach(elem => {
        this.teacherData.forEach((item, index) => {
          if (parseInt(elem.userId) === parseInt(item.userId)) {
            this.$refs.multipleTable.toggleRowSelection(this.teacherData[index], true)
          }
        })
      })
    },
    getTeacherData () {
      this.currRowTeacher = this.curRow
      let params = {
        'query': this.query,
        'examId': this.curRow.id,
        'pageNum': this.currentPageTeacher,
        'pageSize': this.sizeTeacher
      }
      if (this.examType === 1) {
        params.type = 1
      } else {
        params.type = 3
      }
      return this.$ajax({
        method: 'post',
        url: 'baseInfo/examine/getAvailableExamTeachers',
        data: params
      }).then(res => {
        if (res.data.code === 1) {
          res.data.list.forEach(item => {
            item.detailArr = []
            item.signUpDateArr = []
            item.newDetail = ''
            if (item.practiceExamDetail !== null && item.examDetail !== null) {
              item.newDetail = item.practiceExamDetail + ',' + item.examDetail
            } else if (item.practiceExamDetail !== null) {
              item.newDetail = item.practiceExamDetail
            } else {
              item.newDetail = item.examDetail
            }
            if (item.signUpDate) {
              item.signUpDateArr = item.signUpDate.split(',')
            }
            if (item.newDetail) {
              let arr1 = item.newDetail.split(',')
              for (let i = 0; i < arr1.length; i++) {
                let arr2 = arr1[i].split('|')
                let a = {
                  startDate: parseInt(arr2[1]),
                  endDate: parseInt(arr2[2]),
                  type: arr2[0]
                }
                item.detailArr.push(a)
              }
            }
          })
          this.teacherData = res.data.list
          this.totalTeacher = res.data.recordCount
        } else {
          this.$message.error(res.data.desc)
        }
      })
    },
    selectBtn () {
      this.getTeacherData()
    },
    resetBtn () {
      this.query = ''
      this.getTeacherData()
    },
    handleTeacherSizeChange (val) {
      this.sizeTeacher = val
      this.getTeacherData()
    },
    handleTeacherCurrentChange (val) {
      this.currentPageTeacher = val
      this.getTeacherData().then(() => {
        this.operChooseData()
        setTimeout(() => {
          this.checked()
        }, 200)
      })
    },
    operChooseData (row) {
      if (this.chooseTeacherCopy.length === 0) {
        this.chooseTeacher.forEach(item => {
          this.chooseTeacherCopy.push(item)
        })
      } else {
        if (row) {
          let i = this.chooseTeacherCopy.map(function (e) { return parseInt(e.userId) }).indexOf(row.userId)
          if (i >= 0) {
            this.chooseTeacherCopy.splice(i, 1)
          } else if (i < 0) {
            this.chooseTeacherCopy.push(row)
          }
        }
      }
    },
    handleCurrentTeacher (obj, row) {
      this.chooseTeacher = obj
      this.operChooseData(row)
    },
    addTeacher () {
      this.$emit('addTeacher', this.chooseTeacherCopy, this.currRowTeacher)
    },
    inputIsOut (e, row, type) {
      let url = 'baseInfo/teacher/updateTeacher'
      let params = {}
      if (type === 1) {
        row.inBlackList = e ? '1' : '0'
        params = {
          'id': row.userId,
          'inBlackList': row.inBlackList
        }
      } else if (type === 2) {
        row.isNew = e ? '1' : '0'
        params = {
          'id': row.userId,
          'isNew': row.isNew
        }
      }
      this.$confirm('确认修改该教师状态', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$ajax({
          method: 'post',
          url: url,
          data: params
        }).then(res => {
          if (res.data.code === 1) {
            this.$message.success('修改成功')
            this.getTeacherData()
          } else {
            this.$message.error(res.data.desc)
          }
        })
      }).catch(() => {
        this.$message.warning('已取消修改')
        this.getTeacherData()
      })
    }
  }
}
</script>

