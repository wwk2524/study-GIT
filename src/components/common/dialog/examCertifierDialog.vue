<template>
  <div>
    <el-dialog title='安排考评员' :visible.sync="certifierDialog" width="70%" @close="$emit('update:show', false);chooseTeacher=[];chooseTeacherCopy=[]">

            <el-table ref='multipleTable' class='examTeacherData mt30' :data="teacherData" border stripe @select='handleCurrentTeacher'>
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column align="left" label="考评员" prop="name" show-overflow-tooltip sortable></el-table-column>
                <el-table-column align="left" label="等级" prop="level" show-overflow-tooltip sortable>
                  <template slot-scope='scope'>
                    <div>{{levelValue[scope.row.level]}}</div>
                  </template>
                </el-table-column>
                <el-table-column align="left" label="手机号码" prop="telephone" show-overflow-tooltip sortable></el-table-column>
                <el-table-column align="left" label="已安排考试" prop="detail" width='350px' show-overflow-tooltip sortable>
                    <template slot-scope="scope">
                        <div v-for='(item,index) in scope.row.detailArr' :key='index'>
                            {{item.type}}({{$api.getDateAll(item.startDate,'/','hm')}}-{{$api.getDateAll(item.endDate,'/','onlyhm')}})
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <p class='mt20'>找不到考评员？<span class='primary-txt gesture' @click='addCertifierLink'>点击进入补录考评员</span></p>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="certifierDialog=false">取消</el-button>
                <el-button type="primary" size="small" @click="addCertifier">确定</el-button>
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
      type: [String, Number]
    }
  },
  data () {
    return {
      levelValue: ['', '高级考评员(1级)', '考评员(2级)'],
      certifierDialog: this.show,
      currRowTeacher: {},
      teacherData: [],
      chooseTeacher: [],
      chooseTeacherCopy: [],
      schoolAreaId: null
    }
  },
  watch: {
    show () {
      this.certifierDialog = this.show
    },
    curRow (val) {
      this.curRow = val
    }
  },
  mounted () {
    this.schoolAreaId = this.$route.query.schoolAreaId
  },
  methods: {
    addCertifierLink () {
      sessionStorage.removeItem('addCertifierLink')
      sessionStorage.setItem('addCertifierLink', this.$route.fullPath)
      this.$router.push({
        path: '/exam/baseSetting/editTeacher'
      })
    },
    getCertifierData () {
      this.currRowTeacher = this.curRow
      let params = {
        'examId': this.curRow.id,
        'type': this.examType.toString()
      }
      return this.$ajax({
        method: 'post',
        url: 'baseInfo/examine/getAvailableOffExamTeachers',
        data: params
      }).then(res => {
        if (res.data.code === 1) {
          res.data.list.forEach(item => {
            item.detailArr = []
            if (item.hasArranged) {
              let arr1 = item.hasArranged.split(',')
              for (let i = 0; i < arr1.length; i++) {
                let arr2 = arr1[i].split('|')
                let a = {
                  startDate: parseInt(arr2[0]),
                  endDate: parseInt(arr2[1])
                }
                item.detailArr.push(a)
              }
            }
          })
          this.teacherData = res.data.list
        } else {
          this.$message.error(res.data.desc)
        }
      })
    },
    operChooseData (row) {
      if (this.chooseTeacherCopy.length === 0) {
        this.chooseTeacher.forEach(item => {
          this.chooseTeacherCopy.push(item)
        })
      } else {
        if (row) {
          let i = this.chooseTeacherCopy.map(function (e) { return parseInt(e.id) }).indexOf(row.id)
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
    addCertifier () {
      this.$emit('addCertifier', this.chooseTeacherCopy, this.currRowTeacher)
    }
  }
}
</script>

