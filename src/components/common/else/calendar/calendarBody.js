
export default {
  props: {
    curWeekVal: {
      type: Number,
      required: true
    },
    cWid: {
      type: Number,
      required: true,
      default: 190
    },
    cHei: {
      type: Number,
      default: 60
    }
  },
  data() {
    return {
      monDayTime:null,
      calendarBody: [],
      hsitoryCalendarBody: {},
      dayStamp: 24*60*60*1000
    }
  },
  methods: {
    getCalendarBody() {
      let rows = []
      const todayStamp =  new Date().getTime()
      // this.$api.debugConsole('todayStamp', this.$api.getDateAll(todayStamp,'/','hm'))
      // this.$api.debugConsole('this.monDayTime', this.$api.getDateAll(this.monDayTime,'/','hm'))
      for (let i = 0; i < 30; i++) {
        let row = []
        for (let v = 0; v < 7; v++) {
          row.push({
            psX: v,
            psY: i,
            isWeekend: v > 4,
            isLtToday: this.monDayTime + (v)*this.dayStamp < todayStamp
          })
        }
        rows.push(row)
      }
      this.hsitoryCalendarBody[this.curWeekVal] = rows
      return rows
    },
    clickHdarea (e) {
      this.$emit('clickHdarea',e)
    },
    getMonDayTime () {
      // 根据周 计算周一时间
      const time =  new Date().getTime() + this.curWeekVal * 7 * this.dayStamp
      this.monDayTime = this.$api.getMonDayTime(time)
    }
  },
  watch: {
    curWeekVal(nv, ov) {
      //更新开始时间
      this.getMonDayTime()
      this.calendarBody = this.hsitoryCalendarBody[nv] || this.getCalendarBody()
    },
    
  },
  created() {
    // 周数和周一时间 两个是有关联关系的，两同时从父级获得，造成同步时间不同，逻辑错误，所以需要在当前组件自己计算周一时间
    this.getMonDayTime()
    this.calendarBody = this.getCalendarBody()
  }
}
