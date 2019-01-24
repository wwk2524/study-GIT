let weekLabels = {
  '1': '周一',
  '2': '周二',
  '3': '周三',
  '4': '周四',
  '5': '周五',
  '6': '周六',
  '0': '周日'
}
export default {
  props: {
    courseInfo: {
      required: true
    }
  },
  data () {
    return {}
  },
  methods: {
    parseTime (s, e) {
      return {
        dayNa:
          this.$api.getDateAll(s, '/') +
          '(' +
          weekLabels[new Date(s).getDay()] +
          ')',
        sAndE:
          this.$api.getDateAll(s, null, 'onlyhm') +
          '-' +
          this.$api.getDateAll(e, null, 'onlyhm')
      }
    }
  }
}
