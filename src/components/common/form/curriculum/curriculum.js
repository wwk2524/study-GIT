export default{
  props: {
    id: {
      type: [Number, String],
      required: true
    },
    type: {  // 1 工种  2 班级
      type: [Number],
      required: true
    }
  },
  data () {
    return {
      isManager: null,
      baseUrl: this.$api.baseUrl,
      isEdit: 0,
      data: null,
      curriculumDetail: null
    }
  },
  mounted () {
    this.isManager = this.$store.state.isManager
    if (this.id) {
      this.getData()
    }
  },
  watch: {
    curriculumDetail (e) {
      let that = this
      if (this.curriculumDetail.indexOf(';base64,') >= 0) {
        // eslint-disable-next-line
        let reg2 = /\ssrc=\"(.*?)\"/g
        this.$api.replaceAsync(that.curriculumDetail, reg2, (str, p1) => {
          var formDataToUpload = new FormData()
          let fileName = ''
          if (p1.indexOf('image/jpeg') >= 0) {
            fileName = (Math.floor(Math.random() * 900) + 100).toString() + '.jpg'
          } else if (p1.indexOf('image/png') >= 0) {
            fileName = (Math.floor(Math.random() * 900) + 100).toString() + '.png'
          } else if (p1.indexOf('image/gif') >= 0) {
            fileName = (Math.floor(Math.random() * 900) + 100).toString() + '.gif'
          }
          formDataToUpload.append('file', this.convertBase64UrlToBlob(p1), fileName)
          return this.$ajax({
            method: 'post',
            url: 'baseInfo/file/uploadFile',
            data: formDataToUpload
          }).then(res => {
            let str = ''
            if (res.data.code === 1) {
              str = this.baseUrl + 'baseInfo/file/downLoadImg?url=' + res.data.data.filePath.slice(1)
            }
            return ` src="${str}"`
          })
        }).then(str => {
          this.curriculumDetail = str
        })
      } else {
        return this.curriculumDetail
      }
    }
  },
  methods: {
    convertBase64UrlToBlob (urlData) {
      const strs = urlData.split(',')
      var bytes = window.atob(strs[1])        // 去掉url的头，并转换为byte

      // 处理异常,将ascii码小于0的转换为大于0
      var ab = new ArrayBuffer(bytes.length)
      var ia = new Uint8Array(ab)
      for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i)
      }
      return new Blob([ab], {type: strs[0].split(':')[1].split(';')[0]})
    },
    getData () {
      localStorage.removeItem('curriculumDetail')
      this.curriculumDetail = ''
      let url = ''
      if (this.type === 1) {
        url = 'baseInfo/parameter/getSpecialtyTimetableBottomMsg/' + this.id
      } else {
        url = 'baseInfo/classInfo/getClassTimetableBottomDesc/' + this.id
      }
      this.$ajax({
        method: 'get',
        url: url
      }).then(res => {
        if (res.data.code === 1) {
          if (this.type === 1) {
            this.data = res.data.data
            if (res.data.data) {
              this.curriculumDetail = res.data.data.timetableDesc
              localStorage.setItem('curriculumDetail', this.curriculumDetail)
            }
          } else {
            this.curriculumDetail = res.data.data.timetableBottomDesc !== null ? res.data.data.timetableBottomDesc : ''
            localStorage.setItem('curriculumDetail', this.curriculumDetail)
          }
        }
      })
    },
    saveWorkTypeInfo () {
      let url = ''
      let params = {}
      if (this.type === 1) {
        if (this.data !== null) {
          url = 'baseInfo/parameter/updateSpecialtyTimetableBottomMsg'
          params = {
            'id': this.data.id,
            'timetableDesc': this.curriculumDetail
          }
        } else {
          url = 'baseInfo/parameter/addSpecialtyTimetableBottomMsg'
          params = {
            'specialtyId': this.id,
            'timetableDesc': this.curriculumDetail
          }
        }
      } else {
        url = 'baseInfo/classInfo/updateClassTimetableBottomDesc'
        params = {
          'id': this.id,
          'timetableBottomDesc': this.curriculumDetail
        }
      }
      this.$confirm('确认提交', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$ajax({
          method: 'post',
          url: url,
          data: params
        }).then(res => {
          if (res.data.code === 1) {
            this.isEdit = 0
            this.getData()
          } else {
            this.$message.error(res.data.desc)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    }
  }
}
