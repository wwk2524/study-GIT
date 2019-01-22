<template>
  <div class="hello">
    <h1>学生列表页</h1>
    stulist:{{stulist}}
  </div>
</template>

<script>
import api from "./api/stulist";

export default {
  name: "stulist",
  data() {
    return {
      loading: false,
      stulist: []
    };
  },
  methods: {

  },
  created() {
    this.loading = true;
    api
      .getStuList()
      .then(data => {
        this.stulist = data.list;
        this.loading = false;
      })
      .catch(err => {
        this.$message("" + err);
        this.loading = false;
      });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
