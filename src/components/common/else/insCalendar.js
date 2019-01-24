function stopBubble(e) {
  if (e && e.stopPropagation) {
    e.stopPropagation();
  } else {
    window.event.cancelBubble = true;
  }
}
const dayStamp = 24 * 60 * 60 * 1000
const sevenHourStamp = 7 * 60 * 60 * 1000
const halfHourStamp = 30 * 60 * 1000

export default {
  props: {
    allPlans: {
      type: [Object, Array],
      required: true
    },
    cellHei: {
      type: Number,
      default: 50
    },
    computeWeek: {
      type: Number,
      required: true,
      default: 0
    },
    updata: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      // 周制 1-7/7-6
      // 行高 = 半小时 高度

      // props=================================
      computedStep: 0,
      cellWid: 0,
      // 周一凌晨的时间戳
      startStamp: null,
      labels: ['草稿','审批中','通过','驳回'],
      // 表头
      headInfo: [],
      // 表体
      timeScale: [],
      // new empty palns
      selectedEmptys: [],
      showOccupys: [], // 渲染 强制占用的
      selectedOccupys: [],

      showClasses: [], // 渲染占用了课程需要被动调课的
      selsectedClasses: [], // 选中的 需要调课的

      // 通过数值 转换星期
      getWeekLabel: this.$api.getWeekLabel()
    }
  },
  methods: {
    getHeadInfo() {
      let stamp = new Date().getTime() + this.computeWeek * 7 * 24 * 60 * 60 * 1000
      // 得到整点 比如9.6 00:00:00 的时间戳
      stamp = new Date(this.$api.getDateAll(stamp, '/')).getTime()
      const dataTmp = 24 * 60 * 60 * 1000
      let weekVal = new Date(stamp).getDay()
      let sWeekTmp = stamp - (weekVal !== 0 ? weekVal - 1 : 6) * dataTmp
      // 周一的起始日期
      this.startStamp = sWeekTmp
      let weekInfo = []
      for (let i = 0; i < 7; i++) {
        let tmpHere = sWeekTmp + i * dataTmp
        let weekValHere = new Date(tmpHere).getDay()
        weekInfo.push({
          weekName: this.getWeekLabel(weekValHere),
          dateName: this.$api.getDateAll(tmpHere).slice(5)
          // weekValue: weekValHere !== 0 ? weekValHere : 7,
          // stamp: tmpHere,
          // fullDate: this.$api.getDateAll(tmpHere, '-'),
          // thisDay: weekVal === weekValHere
        })
      }
      // this.query.startTime = weekInfo[0].fullDate
      // this.query.endTime = weekInfo[6].fullDate
      return weekInfo;
    },
    // 时间刻度
    getTimeScale() {
      let rows = []
      let rowIndex = 0
      let sTime = 7
      let clockInit = true
      let tableData = []

      while (sTime < 22) {
        let cells = []
        for (let col = 0; col < 7; col++) {
          cells.push({
            rIdx: rowIndex,
            cIdx: col
          })
        }
        rows.push({
          scaleVal: sTime + ':' + (clockInit ? '00' : '30'),
          rowCell: cells
        })
        rowIndex++
        !clockInit && sTime++
        clockInit = !clockInit
      }
      rows.push({
        scaleVal: '22:00'
      })
      return rows
    },
    handlOriginData() {
      // （0 草稿 1 审批中 2 通过 3 驳回）

      this.showOccupys = this.timeToPreviewsPlan(this.allPlans.occupyInfo) // 已占用的渲染

      let contShow = []
      let canShow = this.allPlans.OpenCourseOccupyInfo.filter(item => {
        //审批中 审批通过需要渲染
        //草稿 切有锁定的需要渲染
        if(parseInt(item.status) === 0 && !item.lockRemainingTime){
          contShow.push(this.$api.getDateAll(item.courseStartTime,'/','hm') + this.$api.getDateAll(item.courseEndTime,'/','hm'))
        }
        
        return parseInt(item.status) === 1  || parseInt(item.status) === 2 || (parseInt(item.status) === 0 && item.lockRemainingTime)
      })
      this.$api.debugConsole('撤销的 草稿 有：',contShow.join(','))
      this.showClasses = this.timeToPreviewsClass(canShow) // 有课的渲染
    },
    timeToPreviewsPlan(plans) {
      if (plans.length && plans.length > 0) {
        let resultArr = []
        plans.map(item => {
          item.times.map(cItem => {
            let p = this.timeToPosition(cItem.startTime, cItem.endTime)
            item.x = p.x
            item.y = p.y
            item.h = p.h
            item.s = false
            item.ocClassId = cItem.id
            item.startTime = cItem.startTime
            item.endTime = cItem.endTime
            resultArr.push(JSON.parse(JSON.stringify(item)))
          })
        })
        return resultArr
      }
    },
    timeToPreviewsClass(plans) {
      if (plans.length && plans.length > 0) {
        let resultArr = []
        plans.map(item => {
          let detail = JSON.parse(JSON.stringify(item))
          let p = this.timeToPosition(item.courseStartTime, item.courseEndTime)
          item.x = p.x
          item.y = p.y
          item.h = p.h
          item.s = false
          item.haveOccupy = parseInt(item.status) === 1  || parseInt(item.status) === 2
          item.detail = detail
          resultArr.push(JSON.parse(JSON.stringify(item)))
        })
        return resultArr
      }
    },
    // 点击空白区域 创建空计划 并选中
    clickArea(e) {
      const x = e.layerX - e.layerX % this.cellWid
      const y = e.layerY - e.layerY % this.cellHei
      let times = this.positionToTime(x, y)
      let p = {
        startTime: times.s,
        endTime: times.e,
        x: x,
        y: y,
        k: 'clear',
        h: this.cellHei,
        s: true // 是否选中
      }
      e.layerX > this.cellWid && e.layerY < 30 * this.cellHei && this.selectedEmptys.push(p)
      this.throwSelected()
    },
    // 点击 空计划
    clickEPlan(i) {
      this.selectedEmptys.splice(i, 1)
      this.throwSelected()
      let e = window.event || arguments.callee.caller.arguments[0]
      stopBubble(e)
    },
    // 点击 普通占用
    selectOccupy(item, idx) {
      return false
      let e = window.event || arguments.callee.caller.arguments[0]
      stopBubble(e)
    },
    // 点击课程
    selecteClass(item, idx) {
      this.showClasses[idx].s = !this.showClasses[idx].s
      if (this.showClasses[idx].s) {
        this.selsectedClasses.push(item)
      } else {
        let selIdx = this.$api.getItemIndex(this.selsectedClasses, item.ocClassId, 'ocClassId')
        if (selIdx !== -1) {
          this.selsectedClasses.splice(selIdx, 1)
        }
      }
      this.throwSelected()
      let e = window.event || arguments.callee.caller.arguments[0]
      stopBubble(e)
    },
    // 向父级抛选中结果
    throwSelected() {
      // 选中的课程
      // this.selsectedClasses
      let selectEplan = JSON.parse(JSON.stringify(this.selectedEmptys))
      let selsectedClasses = JSON.parse(JSON.stringify(this.selsectedClasses))
      this.$emit('selectEplan', selectEplan)
      this.$emit('selsectedClasses', selsectedClasses)
    },
    // 根据时间跨度计算位置和高度
    timeToPosition(stamp, endStamp) {
      let xTimes = parseInt((stamp - this.startStamp) / dayStamp)
      let yTimes = parseInt((stamp - this.startStamp - xTimes * dayStamp - sevenHourStamp) / halfHourStamp)
      let cellHeight = parseInt((endStamp - stamp) / halfHourStamp * this.cellHei)
      return {
        x: xTimes * this.cellWid + this.cellWid,
        y: yTimes * this.cellHei,
        h: cellHeight
      }
    },
    positionToTime(x, y) {
      let sDay = parseInt(x / this.cellWid - 1) * dayStamp + this.startStamp
      sDay = sDay + parseInt(y / this.cellHei) * halfHourStamp + sevenHourStamp
      return { s: sDay, e: sDay + halfHourStamp }
    },
    getStatusLabel (s) {
      // （0 草稿 1 审批中 2 通过 3 驳回）
      return this.labels[s] || ''
    }
  },
  watch: {
    updata(nv, ov) {
      this.headInfo = this.getHeadInfo()
      this.handlOriginData()
      this.selectedOccupys = []
      this.selectedEmptys = []
      this.selsectedClasses = []
      this.throwSelected()
    },
    cellWid(nv, ov) {
      this.headInfo = this.getHeadInfo()
      this.timeScale = this.getTimeScale()
    }
  },
  mounted() {
    let domMain = document.querySelector(".handl-area")
    this.cellWid = domMain ? parseInt((domMain.offsetWidth) / 8) - 2 : 190
    // this.computedStep = 1
  }
}
