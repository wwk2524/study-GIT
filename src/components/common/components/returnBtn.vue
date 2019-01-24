<template>
  <div class="ins-page-title">
    <span class="ins-back-icon" @click="returnPage"><i class="el-icon-back"></i></span>{{title}}
  </div>
</template>
<script>
export default {
  data () {
    return {}
  },
  props: {
    title: { // 页面标题
      type: String,
      default: '',
      required: true
    }
  },
  methods: {
    returnPage () {
      this.$router.go(-1)
    }
  }
}
</script>