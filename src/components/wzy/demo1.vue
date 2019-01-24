<template>
  <div>
    <el-row>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span></span>
        </div>

        <div>演示区域</div>

        
      </el-card>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "demo1",
  data() {
    return {
      task:
        "这个文件 用于练习Vue的基本使用方法，比如 v-for v-model v-bind v-class 等等等 s",
      value: "修改这里"
    };
  }
};
</script>

<style scoped>
</style>
