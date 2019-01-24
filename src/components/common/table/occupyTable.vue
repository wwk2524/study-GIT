<template>
  <div>
    <el-row style="text-align:right" class="mb20">
        <el-date-picker
        
        v-model="query.startTime"
        type="date"
        value-format="timestamp"
        :picker-options="sPickerOptions()"
        placeholder="选择日期">
      </el-date-picker>
      <el-date-picker
     
        v-model="query.endTime"
        type="date"
        :picker-options="ePickerOptions()"
        value-format="timestamp"
        placeholder="选择日期">
      </el-date-picker>
      <el-input  v-model="arg" placeholder="输入关键字 如：教室编号/校区/占用人" style="width:250px;padding-right: 10px;"></el-input>
      <el-button size="small" type="primary" round="" @click="getTableData"><span class="el-icon-search "></span> &nbsp;查询</el-button>
      <el-button size="small" type="success" round="" @click="resetSearch">重置</el-button>
    </el-row>

    <div class="ins-page-main">
      <el-table :data="tableData" border id="tab"  stripe style="width:100%;">
        <el-table-column prop="createDate" label="占用申请时间">
          <template slot-scope="scope">
            {{$api.getDateAll(scope.row.createDate,'/')}}
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="使用时间" width="250">
            <template slot-scope="scope">
              <p v-for="(item,idx) in scope.row.times" :key="idx + ''">
                {{$api.getDateAll(item.startTime,'/')}}
                ({{getWeekLabel(new Date(item.startTime).getDay())}})
                {{$api.getDateAll(item.startTime,'/','onlyhm')}}-{{$api.getDateAll(item.endTime,'/','onlyhm')}}
              </p>
          </template>
        </el-table-column>
        <el-table-column prop="classroomCode" label="教室编号"></el-table-column>
        <el-table-column prop="classroomType" label="教室类型"></el-table-column>
        <el-table-column prop="classroomAddr" label="校区"></el-table-column>
        <el-table-column prop="creatorBy" label="占用人"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span :class="status === 0 ? '' : 'danger-txt'">{{statusLableList[scope.row.status]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="handle" label="操作" v-if="status !== 1">
          <template slot-scope="scope">
            <span class="ins-table-card" @click="cancelOccupy(scope.row)">撤销占用</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<style scoped>
.danger-txt{
  color: #f56c6c;
}
</style>
<script>
export default {
  props: {
    status: {
      required: true,
      type: [String, Number]
    }
  },
  data () {
    return {
      statusLableList: this.status === 1 ? ['占用成功', '已过期'] : ['占用成功', '待调课'],
      getWeekLabel: this.$api.getWeekLabel(),
      tableData: [],
      query: {
        requestType: 2,
        startTime: '',
        endTime: ''
      },
      arg: null,
      timeLength: 3 // 查询的时间范围 月
    }
  },
  methods: {
    // 获取表格数据
    getTableData () {
      let sendData = JSON.parse(JSON.stringify(this.query))
      sendData.startTime = this.$api.getDateAll(sendData.startTime, '-')
      sendData.endTime = this.$api.getDateAll(sendData.endTime, '-')
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/classroomController/selectOccupyClassroom',
        data: this.query
      }).then(res => {
        if (res.data.code > 0) {
          this.tableData = res.data.data.occupyInfo.filter(item => this.status === 1 ? parseInt(item.dateStatus) === 1 : parseInt(item.dateStatus) !== 1)
          // 本地过滤
          this.tableDataFilter()
        } else {
          this.$message.error(res.data.desc)
        }
      })
      .catch(err => console.log(err))
    },
    // 查找 过滤
    tableDataFilter () {
      if (!this.arg) {
        return false
      }
      this.tableData.filter(item => {
        return item.classroomCode.indexOf(this.arg) !== -1 || item.creatorBy.indexOf(this.arg) !== -1
      })
    },
    resetSearch () {
      this.query.startTime = new Date().getTime() - this.timeLength / 2 * 30 * 24 * 60 * 60 * 1000
      this.query.endTime = new Date().getTime() + this.timeLength / 2 * 30 * 24 * 60 * 60 * 1000
      this.getTableData()
    },
    confirmCancelOccupy (row) {
      this.$confirm('是否确定撤销占用？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        this.cancelOccupy(row)
      })
    },
    // 取消占用
    cancelOccupy (row) {
      this.$ajax({
        url: 'baseInfo/classroomController/deleteOccupyClassroom',
        method: 'POST',
        data: {
          id: row.id
        }
      }).then(res => {
        if (res.data.code > 0) {
          this.$message.success('操作成功！')
          this.getTableData()
        } else {
          this.$message.error(res.data.desc)
        }
      })
      .catch(err => console.log(err))
    },
    // set start time must bu in 3 month
    sPickerOptions () {
      let that = this
      return {
        disabledDate (time) {
          if (!that.query.endTime) {
            return false
          }
          return !(time.getTime() > that.query.endTime - 3 * 30 * 24 * 60 * 60 * 1000 && time.getTime() < that.query.endTime)
        }
      }
    },
    // set start time must bu in 3 month
    ePickerOptions () {
      let that = this
      return {
        disabledDate (time) {
          if (!that.query.startTime) {
            return false
          }
          return time.getTime() > that.query.startTime + 3 * 30 * 24 * 60 * 60 * 1000 || time.getTime() < that.query.startTime
        }
      }
    }
  },
  created () {
    this.resetSearch()
  }
}
</script>
