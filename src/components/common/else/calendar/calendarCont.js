function stopBubble(e) {
  if (e && e.stopPropagation) {
    e.stopPropagation();
  } else {
    window.event.cancelBubble = true;
  }
}
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
      occInfos: [], // 接收上级数据


      dayStamp: 24 * 60 * 60 * 1000,
      hourStamp: 60 * 60 * 1000,
      halfHourStamp: 30 * 60 * 1000,
      startStamp: null,
      curSelects: [],
      curDises: [],
      selectedHistory: {},
      startStampHistory: {}
    }
  },
  methods: {
    getOccupyInfo() {
      // 获取本周教室 老师的占用信息
      this.$ajax({
          method: 'POST',
          url: 'baseInfo/classroomController/selectOccupyClassroom',
          data: this.query
        }).then(res => {
          if (res.data.code > 0) {
            this.occInfos = res.data.data
          } else {
            this.$message.error(res.data.desc)
          }
        })
        .catch(err => {
          console.log(err)
        })

      this.handlOriginData()
    },
    handlOriginData() {
      let timeSpan = 'times'
      let formatPlan = []
      for (let key in this.allPlans) {
        let plans = this.allPlans[key]
        if (plans && plans.length) {
          plans.map(item => {
            item.times.map(cItem => {
              let p = this.timeToPosition(cItem.startTime, cItem.endTime)
              let cInfo = this.getConflict()
              item.x = p.x
              item.y = p.y
              item.h = p.h
              item.k = key
              item.s = false
              item.startTime = cItem.startTime
              item.endTime = cItem.endTime
              // 在这里，要进行判断 教室占用状态，
              // 教室类型/个数/主讲老师数量
              item.conflict = cInfo.c
              item.title = cInfo.msg
              formatPlan.push(JSON.parse(JSON.stringify(item)))
            })
          })
        }
      }
      this.normalPlans = formatPlan

    },
    getConflict(item) {
      let conflict = false
      let msgs = []
      if (true) {
        conflict = true
        msgs.push('张老师这节有课，教师资源冲突！')
      }
      if (true) {
        conflict = true
        msgs.push('空余教室只有3间，(XX*1,XX*2)')
      }
      return {
        c: conflict,
        msg: msgs.join(';')
      }
    },
    // 点击空白区域
    clickHdarea(e) {
      const x = e.layerX - e.layerX % this.cWid
      const y = e.layerY - e.layerY % this.cHei
      let t = this.positionToTime(x, y)
      let p = {
        startTime: t.s,
        endTime: t.e,
        x: x,
        y: y,
        s: true // 是否选中
      }
      this.curSelects.push(p)
    },
    // remove empty
    delSelect(idx) {
      this.curSelects.splice(idx, 1)
      let e = window.event || arguments.callee.caller.arguments[0]
      stopBubble(e)
    },

    positionToTime(x, y) {
      let sDay = parseInt(x / this.cWid) * this.dayStamp + this.startStamp
      sDay = sDay + parseInt(y / this.cHei) * this.halfHourStamp + this.hourStamp * 7
      return {
        s: sDay,
        e: sDay + this.hourStamp / 2
      }
    },
    timeToPosition(s, e) {
      if (s < this.startStamp) {
        console.error('please check the response data, this start time is less than this week start time!')
      }
      let xTimes = parseInt((s - this.startStamp) / this.dayStamp)
      let yTimes = parseInt((s - this.startStamp - xTimes * this.dayStamp - this.hourStamp * 7) / this.halfHourStamp)
      let cellHeight = parseInt((e - s) / this.halfHourStamp * this.cHei)
      return {
        x: xTimes * this.cWid + this.cHei,
        y: yTimes * this.cHei,
        h: cellHeight
      }
    },
    getStartStamp() {
      let stamp = new Date().getTime() + this.curWeekVal * 7 * this.dayStamp
      // 得到整点 比如9.6 00:00:00 的时间戳
      stamp = new Date(this.$api.getDateAll(stamp, '/')).getTime()
      let weekVal = new Date(stamp).getDay()
      let sWeekTmp = stamp - (weekVal !== 0 ? weekVal - 1 : 6) * this.dayStamp
      // 周一的起始日期
      this.startStampHistory[this.curWeekVal] = sWeekTmp
      return sWeekTmp
    },
    getCurSelects() {
      this.selectedHistory[this.curWeekVal] = []
      return []
    }
  },
  watch: {
    curWeekVal(nv, ov) {
      // 更新本周开始时间
      this.startStamp = this.startStampHistory[nv] || this.getStartStamp()

      // store last selects
      if (this.curSelects.length) {
        this.selectedHistory[ov] = JSON.parse(JSON.stringify(this.curSelects))
      }
      // fentch current select
      this.curSelects = this.selectedHistory[nv] || this.getCurSelects()
    }
  },
  created() {
    this.startStamp = this.getStartStamp()
    this.curSelects = this.getCurSelects()
  }
}
