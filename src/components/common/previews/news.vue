<template>
  <div class='previews'>
    <h3 class='text-center'>{{value.newsTitle}}</h3>
    <p class='text-center'>{{value.newsAuthor}}&nbsp;&nbsp;&nbsp;{{value.createDate}}</p>
    <div class='newCon' v-html="value.newsContent"></div>
  </div>
</template>
<style scoped>
  .previews{
    border:1px solid #ededed;
    width:375px;
    min-height: 667px;
    max-height:667px;
    margin:0 auto;
    overflow: auto;
    background: #fff;
    padding:20px;
    border-radius: 6px;
    word-wrap: break-word;
  }
  .previews p{
    line-height: 30px;
  }
  .newCon >>> img{
    width:100%
  }
</style>
<script>
  export default{
    name: 'News',
    props: {
      value: {
        type: Object,
        default: Object
      }
    },
    data () {
      return {
        data: {}
      }
    },
    watch: {
      value () {
        this.value = this.$store.state.showNews
      }
    },
    mounted () {
      this.value = this.$store.state.showNews
    },
    methods: {
    }
  }
</script>
