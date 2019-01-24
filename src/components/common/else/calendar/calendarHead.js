export default {
  props:{
    curWeekVal:{
      type: Number,
      required: true
    },
    cWid:{
      type: Number,
      required:true,
      default: 190
    },
    cHei:{
      type: Number,
      default: 60
    }
  },
  data() {
    return {

      // mxins
      // hourStamp: 60 * 60 * 1000,
      dayStamp: 24*60*60*1000,
      weekTime: 7 * 24 * 60 * 60 * 1000,
      curWeekInfo: [],
      historyData: {},
      // 通过数值 转换星期
      getWeekLabel: this.$api.getWeekLabel()
    }
  },
  methods: {
    getWeekInfo() {
      const MonDayStamp = this.$api.getMonDayTime(new Date().getTime()) // 真实本周一
      const monDayHere = MonDayStamp + this.curWeekVal*this.weekTime // 该周周一时间
      let realWeekVal = new Date().getDay()
      let weekInfo = []
      for (let i = 0; i < 7; i++) {
        let tmpHere = monDayHere + i * this.dayStamp
        let weekValHere = new Date(tmpHere).getDay()
        weekInfo.push({
          weekName: this.getWeekLabel(weekValHere),
          dateName: this.$api.getDateAll(tmpHere).slice(5),
          mark: weekValHere === realWeekVal && this.curWeekVal === 0
          // 这里需要根据后台，请求假期情况
        })
      }
      this.historyData[this.curWeekVal] = weekInfo
      return weekInfo
    },
    getTodayStartStamp () {
    const todayTime = new Date().setHours(0, 0, 0, 0)
    return todayTime
    }
  },
  watch: {
    curWeekVal(nv, ov) {
      this.curWeekInfo = this.getWeekInfo()
    }
  },
  created() {
    this.curWeekInfo = this.getWeekInfo()
  }
}
