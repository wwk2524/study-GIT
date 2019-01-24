<template>
    <span>
        {{content}}
    </span>
</template>
<script>
function simpleCount (t) {
  if (t < 0) {
    return 0
  }
  let h = parseInt(t / (60 * 60))
  let m = parseInt((t % (60 * 60)) / 60)
  let s = parseInt((t % (60 * 60) % 60))
  return h + ':' + m + ':' + s
}
export default {
  data () {
    return {
      content: null,
      remaining: null,
      interValNo: null
    }
  },
  created () {
    this.getStartTime()
  },
  beforeDestroy () {
    clearInterval(this.interValNo)
  },
  methods: {
    getStartTime () {
      let isClose = sessionStorage.getItem('isClose')
      sessionStorage.removeItem('isClose')
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/courseInfo/findCourseInfoByPage',
        data: {pageNum: 1, pageSize: 20, isClose: parseInt(isClose) === 0 ? 0 : 1, queryValue: JSON.parse(sessionStorage.getItem('classCode'))}
      })
      .then(res => {
        if (res.data.code > 0) {
          if (res.data.data.list && res.data.data.list[0] && res.data.data.list[0].lockRemainingTime) {
            this.remaining = (new Date().getTime() - res.data.data.list[0].lockRemainingTime) / 1000
            const totleTime = 48 * 60 * 60
            if (totleTime > this.remaining) {
              this.remaining = totleTime - this.remaining
            } else {
              this.remaining = 0
              this.content = '00:00:00'
            }
            this.countEquationTime()
          } else {
            this.content = '00:00:00'
          }
        } else {
          this.$message.error(res.data.desc)
        }
      })
      .catch(err => console.log(err))
    },
    countEquationTime () {
      if (this.remaining) {
        this.interValNo = window.setInterval(() => {
          this.remaining--
          this.content = simpleCount(this.remaining)
        }, 1000)
      }
    }
  }
}
</script>
