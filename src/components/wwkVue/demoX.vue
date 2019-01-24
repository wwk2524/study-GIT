  <template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="date" label="日期" width="180"></el-table-column>
    <el-table-column prop="name" label="姓名" width="180"></el-table-column>
    <el-table-column prop="address" label="地址"></el-table-column>
  </el-table>
</template>
<script>
import api from "@/api/common/account";
export default {
  data() {
    return {
      tableData: []
    };
  },
  methods: {
    getTableData() {
      api
        .getTableData()
        .then(requst => {
          if (requst.success === true) {
            this.tableData = res.data;
          } else {
            this.$message.error(requst.message, 3);
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