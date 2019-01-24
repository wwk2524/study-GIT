export default {
  props:{
    cWid:{
      type: Number,
      required: true,
      default:190
    },
    cHei:{
      type: Number,
      required: true,
      default:60
    }
  },
  data() {
    return {
      scaleRows:[]
    }
  },
  methods: {
    getTimeScale() {
      let rows = []
      let sTime = 7
      let clockInit = true
      while (sTime < 22) {
        let cells = []
        rows.push({
            scaleVal: sTime + ':' + (clockInit ? '00' : '30'),
          })
          !clockInit && sTime++
          clockInit = !clockInit
      }
      rows.push({
        scaleVal: '22:00'
      })
      return rows
    }
  },
  created() {
    this.scaleRows = this.getTimeScale()
  }
}
