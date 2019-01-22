<template>
  <div class="hello">
    <h1>学生详情页</h1>
    id:{{id}}
  </div>
</template>

<script>
export default {
  name: "stuDetial",
  props: {
    id: [String, Number]
  },
  data() {
    return {};
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
