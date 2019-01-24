import returnBtn from '@/components/common/components/returnBtn'
import tableBar from '@/components/common/components/tableBar'
import { cityData } from '@/components/common/js/city_Data'
import positive from '@/components/common/studentCard/positive.vue'
let regex1 = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]/
export default {
  name:'addStudent',
  components: { tableBar, returnBtn, positive },
  data () {
    return {
      classTypeValue: null,
      workTypeValue: null,
      classTypeOptions: null,
      workTypeOptions: null,
      categoryId: null,
      specialtyId: null,
      select: null,
      invoiceNum: null,
      nativePlaceName: null,
      signUpClassOwn: null,
      isPrintInvoiceValue: null,
      studentCardBackDetail: '',
      cardDataList: [],
      token: '',
      baseUrl: this.$api.baseUrl,
      cityOptions: cityData, // 省市区
      cityTwoValue: [],
      stuNative: [],
      step: 1,
      imageUrl: '',
      sexOptionsValue: ['女', '男'],
      sexOptions: [
        { value: '0', label: '女' },
        { value: '1', label: '男' }
      ],
      educationOptionsValue: ['小学', '初中', '高中', '中专', '专科', '本科', '硕士', '博士'],
      educationOptions: [
        { value: '0', label: '小学' },
        { value: '1', label: '初中' },
        { value: '2', label: '高中' },
        { value: '3', label: '中专' },
        { value: '4', label: '专科' },
        { value: '5', label: '本科' },
        { value: '6', label: '硕士' },
        { value: '7', label: '博士' }
      ],
      userPhoto: {},
      userInfo: {},
      classOptions: [], // 班级列表
      isConfirm: true, // 学费
      isPrintInvoice: true, // 打印发票
      teachingData: [], // 教材
      applyOption: [], // 希望报名点
      natureList: ['', '社会招生', '联合开班'],
      classDetailData: {}, // 编辑详情
      bookList: [],
      bookNum: '', // 总计多少本
      stuId: '', // 学生id
      clId: '', // 班级id
      csId: '', // 班级学生id
      onePre: 0, // 第二步是否有操作过上一步
      chooseBookData: [], // 选中教材
      one: {
        'studentName': '',
        'studentSex': '',
        'studentEducation': '',
        'studentIdCard': '',
        'classId': '',
        'studentPhone': '',
        'regPhoto': '',
        'isChinese': false,
        'studentBirthday': ''
      },
      two: {
        'printInvoiceValue': ''
      },
      oneRules: {
        studentName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { max: 20, message: '20个字符以内', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5]+$/, message: '姓名须为汉字', trigger: 'blur' }
        ],
        studentSex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        studentEducation: [
          { required: true, message: '请选择学历', trigger: 'change' }
        ],
        isChinese: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        studentIdCard: [
          { required: true, message: '请输入身份证', trigger: 'blur' }
        ],
        studentBirthday: [
          {required: true, message: '请选择出生日期', trigger: 'change'}
        ],
        classId: [
          { required: true, message: '请选择班级', trigger: 'change' }
        ],
        studentPhone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^[1][0-9]{10}$/, message: '手机号码格式有误', trigger: 'blur' }
        ]
      },
      threeRules: {
        studentEmail: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        unemploymentNuimber: [
          { pattern: /^[A-Za-z0-9]{0,16}$/, message: '长度在16个字符以内', trigger: 'blur' }
        ],
        position: [
          { max: 10, message: '长度在10个字符以内', trigger: 'blur' }
        ],
        workUnit: [
          { max: 15, message: '长度在15个字符以内', trigger: 'blur' }
        ],
        remark: [
          { max: 500, message: '长度在500个字符以内', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.cityTwoValue = this.$api.getBirthplace(this.cityOptions)
    this.token = sessionStorage.getItem('user_token')
    sessionStorage.removeItem('twoDataStudent')
    sessionStorage.removeItem('fourDataStudent')
    if (this.$route.query.studentId) {
      this.signUpClassOwn = JSON.parse(sessionStorage.getItem('signUpClassOwn'))
      this.isPrintInvoiceValue = this.$route.query.isPrintInvoice !== '0'
      this.stuId = this.$route.query.studentId
      this.clId = this.$route.query.classId
      this.select = this.$route.query.select
      this.invoiceNum = this.$route.query.invoiceNum
      this.csId = this.$route.query.csId
      this.categoryId = this.$route.query.categoryId
      this.specialtyId = this.$route.query.specialtyId
      this.getStudentDetail()
    }
    this.getClassOptions()
  },
  methods: {
        // 班级列表
    getClassOptions () {
      return this.$ajax({
        method: 'get',
        url: 'baseInfo/classStudent/getExamineClassInfo'
      }).then(res => {
        if (res.data.code === 1) {
          this.classTypeOptions = res.data.list
          if (this.categoryId) {
            this.classTypeOptions.forEach(item => {
              if (parseInt(this.categoryId) === item.category) {
                this.classTypeValue = item.category
                this.changeClassType()
              }
            })
          }
        } else {
          this.$message.error(res.data.desc)
        }
      })
    },
    changeClassType () {
      this.workTypeOptions = null
      this.classOptions = null
      this.workTypeValue = null
      this.one.classId = null
      this.classTypeOptions.forEach(item => {
        if (item.category === this.classTypeValue) {
          this.workTypeOptions = item.specialties
          if (this.specialtyId) {
            this.workTypeOptions.forEach(item => {
              if (parseInt(this.specialtyId) === item.specialty) {
                this.workTypeValue = item.specialty
                this.changeWk()
              }
            })
          }
        }
      })
    },
    changeWk () {
      this.classOptions = null
      this.one.classId = null
      this.workTypeOptions.forEach(item => {
        if (item.specialty === this.workTypeValue) {
          this.classOptions = item.classDetails
          if (this.clId) {
            this.classOptions.forEach(item => {
              if (parseInt(this.clId) === item.classId) {
                this.one.classId = item.classId
                this.classDetail(this.one.classId)
              } else {
                this.classDetail(this.clId)
              }
            })
          }
        }
      })
    },
    // 预报名学员教材信息
    studentBook (sId, cId) {
      this.step = 2
      this.$ajax({
        method: 'get',
        url: 'baseInfo/textbook/getPreRecieveTextbooks/' + cId
      }).then(res => {
        if (res.data.code === 1) {
          this.bookList = res.data.list
          setTimeout(() => {
            this.bookList.forEach((item, index) => {
              this.$refs.multipleTable.toggleRowSelection(this.bookList[index], true)
            }, 200)
          })
          this.bookNum = this.bookList.length
        } else {
          this.$message.error(res.data.desc)
        }
      })
    },
    // 查询学生信息
    getStudentDetail () {
      return this.$ajax({
        method: 'get',
        url: 'baseInfo/classStudent/getStudetInfo/' + this.stuId
      }).then(res => {
        if (res.data.code === 1) {
          this.one.studentName = res.data.data.studentName
          this.one.studentSex = res.data.data.studentSex
          this.one.studentEducation = res.data.data.studentEducation
          this.one.studentIdCard = res.data.data.studentIdCard
          this.one.studentPhone = res.data.data.studentPhone
          this.one.isChinese = !!parseInt(res.data.data.isChinese)
          this.one.studentBirthday = this.$api.getDateAll(res.data.data.studentBirthday, '-')
          if (res.data.data.regPhoto) {
            this.imageUrl = this.baseUrl + 'baseInfo/file/downLoadImg?url=' + res.data.data.regPhoto.slice(1)
          }

          this.userInfo = res.data.data
          if (res.data.data.nativePlace) {
            this.nativePlaceName = res.data.data.nativePlace.split(',')
            this.stuNative = this.$api.pcaMerge(this.cityOptions, '', this.nativePlaceName[0], this.nativePlaceName[1])
          }
        } else {
          this.$message.error(res.data.desc)
        }
      })
    },
    // 班级详情
    classDetail (id) {
      this.$ajax({
        method: 'get',
        url: 'baseInfo/classStudent/getClassInfo/' + id
      }).then(res => {
        if (res.data.code === 1) {
          this.classDetailData = res.data.data
        } else {
          this.$message.error(res.data.desc)
        }
      })
    },
    // 上传图片 成功后
    handleAvatarSuccess (res, file) {
      if (res.code === 1) {
        this.$message.success(res.desc)
        this.userPhoto = res.data
        let filePath = res.data.filePath
        // 向公共头部更新数据
        if (filePath) {
          this.imageUrl = this.baseUrl + 'baseInfo/file/downLoadImg?url=' + filePath.slice(1)
        }
      } else {
        this.$message.error(res.desc)
      }
    },
    // 上传图片成功前
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    // 希望报名点
    getSignUp () {
      let params = {
        'paraNames': ['signUpAddress']
      }
      return this.$ajax({
        method: 'post',
        url: 'baseInfo/parameter/getParaTree',
        data: params
      }).then(res => {
        if (res.data.code === 1) {
          res.data.data.signUpAddress.forEach(item => {
            let a = {
              label: item.paraValue,
              value: item.id
            }
            this.applyOption.push(a)
          })
        } else {
          this.$message.error(res.data.desc)
        }
      })
    },
    // 上一步
    prePage (id) {
      if (id === 1) {
        this.onePre = 1
        this.getStudentDetail()
        this.one.isChinese = !!parseInt(this.one.isChinese)
      } else if (id === 2) {
        this.studentInfo()
        this.studentBook(this.stuId, this.clId)
      }
      this.step = id
    },
    // 学籍信息
    studentInfo () {
      // 学籍信息
      let p, c
      let a = this.$api.pcaSeparation(this.cityOptions, this.stuNative, p, c).toString()
            // let a = this.pcaSeparation(this.stuNative, p, c).toString()
      let nativePlace = a.slice(0, a.length - 1)
      let param = {
        'id': this.userInfo.id ? this.userInfo.id : this.stuId,
        'studentEmail': this.userInfo.studentEmail,
        'unemploymentNuimber': this.userInfo.unemploymentNuimber,
        'position': this.userInfo.position,
        'nativePlace': nativePlace,
        'workUnit': this.userInfo.workUnit,
        'remark': this.userInfo.remark
      }
      sessionStorage.removeItem('fourDataStudent')
      sessionStorage.setItem('fourDataStudent', JSON.stringify(param))
    },
    // 第一步下一步
    next (formName) {
      if (this.select) {
        this.studentBook(this.stuId, this.clId)
        this.isPrintInvoice = false
      } else {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let regex2 = /^[A-Za-z0-9]{1,18}$/
            if (!regex1.test(this.one.studentIdCard) && this.one.isChinese) {
              this.$message.warning('身份证格式有误')
              return false
            } else if (!regex2.test(this.one.studentIdCard) && !this.one.isChinese) {
              this.$message.warning('身份证格式有误')
              return false
            }
            this.one.regPhoto = this.userPhoto.filePath
            this.one.isChinese = this.one.isChinese ? '1' : '0'
            if ((this.stuId && this.onePre === 1) || this.stuId) {
              this.one.studentId = parseInt(this.stuId)
              this.one.classStudentId = this.csId
              this.one.studentBirthday = typeof this.one.studentBirthday === 'number' ? this.one.studentBirthday : Date.parse(this.one.studentBirthday)
              this.$ajax({
                method: 'post',
                url: 'baseInfo/classStudent/updateClassStudentDetail',
                data: this.one
              }).then(res => {
                if (res.data.code === 1) {
                  this.studentBook(this.stuId, this.one.classId)
                } else {
                  this.$message.error(res.data.desc)
                }
              })
            } else {
              this.one.studentBirthday = Date.parse(this.one.studentBirthday)
              this.$ajax({
                method: 'post',
                url: 'baseInfo/classStudent/addStudentToClass',
                data: this.one
              }).then(res => {
                if (res.data.code === 1) {
                  this.stuId = res.data.data.studentId
                  this.csId = res.data.data.classStudentId
                  this.studentBook(res.data.data.studentId, this.one.classId)
                } else {
                  this.$message.error(res.data.desc)
                }
              })
            }
          }
        })
      }
    },
    nextTwo () {
      if (this.select) {
        this.step = 3
      } else {
        let regex = /^[A-Za-z0-9]{1,12}$/
        if (this.isConfirm === false) {
          this.$message.warning('请先确认学费已交！')
          return
        }
        if (this.isPrintInvoice === true && this.two.printInvoiceValue === '') {
          this.$message.warning('请输入发票号！')
          return
        } else if (this.isPrintInvoice === true && !regex.test(this.two.printInvoiceValue)) {
          this.$message.warning('请输入1-12位的数字或字符')
          return
        }
      }
      let arr = []
      if (this.chooseBookData.length !== 0) {
        this.chooseBookData.forEach(item => {
          arr.push(item.id.toString())
        })
      }
      let params = {
        'studentId': this.stuId,
        'classId': this.one.classId,
        'textbookIds': arr
      }
      sessionStorage.removeItem('twoDataStudent')
      sessionStorage.setItem('twoDataStudent', JSON.stringify(params))
      this.getStudentDetail().then(() => {
        let newArr = JSON.parse(sessionStorage.getItem('fourDataStudent'))
        if (newArr) {
          this.userInfo.studentEmail = newArr.studentEmail
          this.userInfo.unemploymentNuimber = newArr.unemploymentNuimber
          this.userInfo.position = newArr.position
          this.userInfo.nativePlace = newArr.nativePlace
          this.userInfo.workUnit = newArr.workUnit
          this.userInfo.remark = newArr.remark
        }
      })
      this.step = 3
    },
    nextfour (formName) {
      if (this.select) {
        this.step = 4
        this.getStudentCard()
        this.getBack()
      } else {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 学籍信息
            this.studentInfo()
            let recieveBookVO = JSON.parse(sessionStorage.getItem('twoDataStudent'))
            let studentVO = JSON.parse(sessionStorage.getItem('fourDataStudent'))
            // 完成
            let classStudentMappingVO = {
              'id': parseInt(this.csId),
              'isConfirm': Number(this.isConfirm).toString(),
              'isPrintInvoice': Number(this.isPrintInvoice).toString(),
              'invoiceNum': this.two.printInvoiceValue,
              'type': '2'
            }
            let params1 = {
              'studentVO': studentVO,
              'classStudentMappingVO': classStudentMappingVO,
              'recieveBookVO': recieveBookVO
            }

            this.$ajax({
              method: 'post',
              url: 'baseInfo/classStudent/doneSignUps',
              data: params1
            }).then(res => {
              if (res.data.code === 1) {
                this.step = 4
                this.getStudentCard()
                this.getBack()
              } else {
                this.$message.error(res.data.desc)
              }
            })
          }
        })
      }
    },
    // 完成返回列表页
    backList () {
      this.$router.replace({
        path: '/signUp/preSignUpList'
      })
    },
    // 教材列表选中
    handleSelectionChange (obj) {
      this.chooseBookData = obj
    },
    getStudentCard () {
      let url = ''
      if (this.select) {
        url = 'baseInfo/classInfo/generateStuentCard/' + parseInt(this.clId)
      } else {
        url = 'baseInfo/classInfo/generateStuentCard/' + parseInt(this.one.classId)
      }
      this.$ajax({
        method: 'post',
        url: url,
        data: [parseInt(this.stuId)]
      }).then(res => {
        if (res.data.code === 1) {
          res.data.list.forEach(item => {
            item.imageUrl = item.regPhoto ? this.baseUrl + 'baseInfo/file/downLoadImg?url=' + item.regPhoto.slice(1) : ''
          })
          this.cardDataList = res.data.list
        } else {
          this.$message.error(res.data.desc)
        }
      })
    },
    getBack () {
      this.$ajax({
        method: 'post',
        url: 'baseInfo/parameter/getParaTree',
        data: { 'paraNames': ['studentCardBackDetail'] }
      }).then(res => {
        if (res.data.code === 1) {
          this.studentCardBackDetail = res.data.data.studentCardBackDetail.length !== 0 ? res.data.data.studentCardBackDetail[0].paraDesc : null
        } else {
          this.$message.error(res.data.desc)
        }
      })
    },
    // 打印
    printStudentCard (name) {
      let dom = document.querySelectorAll(name)
      if (document.querySelector('#printf')) {
        document.getElementById('app').removeChild(document.querySelector('#printf'))
      }
      let iframe = document.createElement('iframe')
      iframe.style.visibility = 'hidden'
      iframe.style.height = 0
      document.getElementById('app').appendChild(iframe)
      iframe.id = 'printf'
      let f = document.getElementById('printf')
      var thisCss = `.item{width:332px;height:414px;border:1px solid #d2d2d2;position:relative;}
                    .student-card-name{font-size: 14px;color: #fff;height: 63px;text-align:center; background: #0092F3;line-height: 63px;margin-top:-10px;}
                    .student-logo{width: 50px;height: 50px;vertical-align: middle;}
                    .student-card-padding{padding: 0 18px 0 26px;}
                    .student-card-padding p{ margin-top:-11px;font-size: 12px;color: #4D4D4D;font-weight: bold;}
                    .student-card-padding p span{font-weight: 100;}
                    .tips{margin: 5px 0 15px;font-weight: bold;font-size: 11px;}
                    .tips-detail{font-size: 11px;font-weight: 100;}
                    .student-card-title{text-align:center;font-size: 25px;color: rgba(77, 77, 77, 1);margin: -10px 0 20px;}
                    .photo{position: absolute;width: 69px;height: 96px;right: 15px;top: 110px;background: #f0f0f0;}
                    .uhr-img{width: 100%;height: 100%;background-repeat: no-repeat;background-size: cover;background-color: #fff;background-position: center;}
                    .back-item{padding: 104px 30px 30px;}
                    .back-item-tips{font-size: 16px;font-weight: bold;margin-bottom: 10px;color: #4D4D4D;}
                    .back-item-con{font-size: 12px;color: #4D4D4D;}`
      var strBodyStyle = '<style>' + thisCss + '</style>'
      var strFormHtml = strBodyStyle + '<body>' + dom[0].outerHTML + '</body>'
      var printHtml =
      strBodyStyle + '<body>' + strFormHtml + '</body></html>'
      f.contentDocument.write(printHtml)
      f.contentDocument.close()
      setTimeout(() => {
        f.contentWindow.print()
      }, 1000)
    },
    printPositive () {
      this.printStudentCard('.positive-card')
    },
    printBack () {
      this.printStudentCard('.back-card')
    }
  },
  watch: {
    'one.studentIdCard' () {
      if (this.one.isChinese && regex1.test(this.one.studentIdCard)) {
        this.one.studentBirthday = this.$api.IdCard(this.one.studentIdCard)
        this.one.studentSex = this.$api.isOdd(this.one.studentIdCard)
      }
      if (!this.one.studentIdCard && this.one.isChinese) {
        this.one.studentBirthday = null
        this.one.studentSex = null
      }
    },
    'one.isChinese' () {
      if (this.one.isChinese && regex1.test(this.one.studentIdCard)) {
        this.one.studentBirthday = this.$api.IdCard(this.one.studentIdCard)
        this.one.studentSex = this.$api.isOdd(this.one.studentIdCard)
      }
    }
  }
}
