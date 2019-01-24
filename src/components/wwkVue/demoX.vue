  <template>
  <div>
      <el-button type="primary" @click="getTableData">刷新表格数据</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="日期" width="180"></el-table-column>
      <el-table-column prop="name" label="姓名" width="180"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
    </el-table>
  </div>
</template>
<script>
import api from "@/api/common/account";
export default {
  name: "demoX",
  data() {
    return {
      tableData: []
    };
  },
  methods: {
    getTableData() {
      api
        .getTableData()
        .then(response => {
          if (response.success === true) {
            this.tableData = response.data;
          } else {
            this.$message.error(response.message, 3);
          }
        })
        .catch(message => {
          this.$message.error(message);
        });
    }
  },
  // 钩子函数
  // 页面打开时会执行
  created() {
    this.getTableData();
  }
};
</script>