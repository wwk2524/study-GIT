import returnBtn from '@/components/common/components/returnBtn'
import iconBtnGroup from '@/components/common/button/iconBtnGroup.vue'
import startYear from '@/components/common/select/startYear'
import schoolArea from '@/components/common/select/schoolArea'
import classTime from '@/components/common/select/classTime'
import applyInfo from '@/components/common/dialog/classApplyInfo'
import bookList from '@/components/common/table/booksTable/bookList.vue'

function getPidByCid (list, cId, idNa = 'id', pidNa = 'parentId', childNa = 'sonList') {
  if (list && list.length > 0) {
    for (var i = list.length - 1; i >= 0; i--) {
      let pItem = list[i]
      if (pItem[idNa] === cId) {
        return pItem[pidNa]
        break
      } else if (pItem[childNa] && pItem[childNa].length) {
        let pId = getPidByCid(pItem[childNa], cId, idNa, pidNa, childNa)
        if (pId) {
          return pId
          break
        }
      } else {
      }
    }
  }
}
export default {
  name:'apply',
  components: {
    returnBtn,
    iconBtnGroup,
    startYear,
    schoolArea,
    classTime,
    applyInfo,
    bookList
  },
  data () {
    return {
      id: null,
      formData: {
        nature: null,
        classTextbookList: []
      },
      showInfoData: {
        categoryName: null, // 类别汉字
        natureName: null, // 性质汉字
        specialtyName: null, // 工种名字
        processName: null
        // bookList: []
        // upAreaNames:null, // 报名地点
        // classAddrName: null // 上课地点
      },
      showInfoData2: {},
      paraTree: {}, // 字典树

      step: 1, // 步骤
      bookDialogVisable: false,
      firstRender: true,
      firstInEdit: true,
      specialtyList: [], // 当前的工种列表
      // processNameList: [], // 流程列表
      natureNameList: [{
        paraValue: '社会招生',
        id: 1
      }, {
        paraValue: '联合开班',
        id: 2
      }],
      classNumber: null, // 班号
      rules1: {
        year: [{
          required: true,
          message: '必填！',
          trigger: 'change'
        }],
        category: [{
          required: true,
          message: '必填！',
          trigger: 'change'
        }],
        specialty: [{
          required: true,
          message: '必填！',
          trigger: 'change'
        }],
        nature: [{
          required: true,
          message: '必填！',
          trigger: 'change'
        }],
        jointUnit: [{
          validator: this.checkjointUnit,
          message: '必填！',
          trigger: 'blur'
        },
        {
          validator: this.checkjointUnit,
          message: '必填！',
          trigger: 'change'
        }],
        startDate: [{
          required: true,
          message: '请输入开班日期',
          trigger: 'change'
        }, {
          validator: this.checkStartDate,
          trigger: 'change'
        }],
        endDate: [{
          required: true,
          message: '请输入结业日期',
          trigger: 'change'
        }, {
          validator: this.checkDateLogic,
          trigger: 'change'
        }],
        closingUpDate: [{
          required: true,
          message: '请输入截止报名日期',
          trigger: 'change'
        }, {
          validator: this.checkSignUpDate,
          trigger: 'change'
        }]
      },
      rules2: {
        tuition: [{ required: true, message: '必填！', trigger: 'blur' }, { pattern: /^[0-9]+$/, message: '输入不合法', trigger: 'blur' }],
        upArea: [{ required: true, message: '必填！', trigger: 'blur' }],
        classTeacher: [{ required: true, message: '必填！', trigger: 'blur' }, { max: '20', message: '不超过20个字符', trigger: 'blur' }],
        costNumber: [{ required: true, message: '必填！', trigger: 'blur' }, { pattern: /^[0-9]+$/, message: '输入不合法', trigger: 'blur' }],
        classAddr: [{ required: true, message: '必填！', trigger: 'blur' }],
        contactNumber: [{ required: true, message: '必填！', trigger: 'blur' }, { pattern: /^[1][0-9]{10}$/, message: '输入不合法', trigger: 'blur' }],
        quotaNumber: [{ required: true, message: '必填！', trigger: 'blur' }, { pattern: /^[0-9]+$/, message: '输入不合法', trigger: 'blur' }],
        minimumNumber: [{ required: true, message: '必填！', trigger: 'blur' }, { pattern: /^[0-9]+$/, message: '输入不合法', trigger: 'blur' }],
        classTime: [{ required: true, message: '必填！', trigger: 'blur' }],
        classDesc: [{ required: true, message: '必填！', trigger: 'blur' }, { max: '200', message: '不超过200个字符', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 通过id 编辑
    initDataById () {
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/setUp/selectSetupClassInfoById/' + this.id,
        data: {}
      })
        .then(res => {
          if (res.data.code > 0) {
            this.formData = res.data.list[0]
            this.formData.upArea = this.formData.registrationSite.split(',').map(i => parseInt(i))
            this.getParaTree()
          } else {
            this.$message.error(res.data.desc)
          }
        })
        .catch(err => console.log(err))
    },
    // 通过工种 完善
    initDataBySpecialty () {
      this.getSpecialtyTextbooks(this.specialty)
      this.$ajax({
        method: 'GET',
        url: 'baseInfo/parameter/getSpecialtyDetail/' + this.specialty,
        data: null
      })
        .then(res => {
          if (res.data.code > 0) {
            this.initData()
            let detail = res.data.data
            // 这里 工种带回了部分数据，选择性的继承
            this.$api.receiveExtend(this.formData, detail)
            // 部分字段不统一 逐个继承
            this.formData.specialty = detail.specialtyId
            // 需要根据工种反推出 类别 工种列表
            this.getParaTree()
          } else {
            this.$message.error(res.data.desc)
          }
        })
        .catch(err => console.log(err))
    },
    // 初始化
    initData () {
      function init () {
        return {
          'category': null, // 类别
          'specialty': null, // 工种
          'year': null,
          'nature': null, // 性质
          'jointUnit': null,
          'tern': null,
          'classCode': null,
          'classTime': null,
          'startDate': null,
          'endDate': null,
          'closingUpDate': null,
          'contactNumber': null,
          'tuition': null, // 学费
          'costNumber': null, // 成本人数
          'quotaNumber': null, // 限额人数
          // 'processId': null,
          'upArea': [], // 报名地点
          'registrationSite': null, // 报名地点”1,2,3”,
          'registrationSiteName': null, // 报名地点
          'classAddr': null,  // 开班地址id
          'classAddrName': null, // 开班地址
          'classDesc': null, // 工种简介
          'classTeacher': null, // 联系老师
          'schoolCode': null, // ???
          'classStatus': null, // 班级状态（0 通过审批 1 审批中 2 驳回）
          'dismissal': null, // 驳回原因
          'arg1': null,
          'arg2': null,
          minimumNumber: 0,
          classTextbookList: []
        }
      }
      this.formData = init()
    },
    // 获取字典
    // 类别 category 级别level 校区 schoolArea 报名地点 signUpAddress
    getParaTree () {
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/parameter/getParaTree',
        data: {
          'paraNames': ['category']
        }
      })
        .then(res => {
          if (res.data.code > 0) {
            this.paraTree = res.data.data
            // 树回来后 // 如果不是新建 要查询几个默认的label值
            this.categoryChange()
            if (this.formData.nature) {
              this.natureChange(this.formData.nature)
            }
          } else {
            this.$message.error(res.data.desc)
          }
        })
        .catch(err => console.log(err))
    },
    // 类别改变
    categoryChange () {
      // 类别改变 1 清空期数和工种值 2 获取类别label
      // ( 首次执行不清空)
      if (this.firstRender) {
        // 如果从（意向列表过来，那么只有工种id,没有类别id）那么反推类别的id值
        if (this.specialty) {
          this.formData.specialty = this.specialty
          this.formData.category = getPidByCid(this.paraTree.category, this.specialty)
          if (!this.formData.category) {
            this.$message('请检查工种id，未找到所属类别！')
          }
        }
      } else {
        this.formData.specialty = null
        this.formData.tern = null
      }
      this.showInfoData.categoryName = this.getLabel(this.paraTree.category, this.formData.category, 'id', 'paraValue')
      this.getSpecialtyList()
    },
    // 根据 类别id获取工种候选列表
    getSpecialtyList () {
      let arr = this.paraTree.category
      let arrIndx = null
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === this.formData.category) {
          arrIndx = i
          break
        }
      }
      if (arrIndx !== null && this.paraTree.category[arrIndx].sonList && this.paraTree.category[arrIndx].sonList.length) {
        this.specialtyList = this.paraTree.category[arrIndx].sonList
        if (this.id !== undefined) {
          // 如果是编辑 只需要把工种名渲染出来 其他不允许改变
          this.showInfoData.specialtyName = this.getLabel(this.specialtyList, this.formData.specialty, 'id', 'paraValue')
        } else {
          this.specialtyChange(this.formData.specialty) // 工种
        }
      } else {
        this.specialtyList = []
      }
    },
    // 工种改变
    specialtyChange (id) {
      if (id) {
        this.showInfoData.specialtyName = this.getLabel(this.specialtyList, id, 'id', 'paraValue')
        this.getNextTern()
        if (this.id) { return false }
        // 如果是编辑 ，工种不允许改变，这一动作不允许执行
        this.getSpecialtyDetail(id)
        this.getSpecialtyTextbooks(id)
      }
    },
    // 根据工种得到第二页的数据
    getSpecialtyDetail (id) {
      this.$ajax({
        method: 'GET',
        url: 'baseInfo/parameter/getSpecialtyDetail/' + id,
        data: {}
      })
        .then(res => {
          if (res.data.code > 0) {
            let resDeital = res.data.data
            if (resDeital.registrationSite) {
              this.formData.upArea = resDeital.registrationSite.split(',').map(i => parseInt(i))
            }
            this.formData.classTeacher = resDeital.contactTeacher
            this.formData.classDesc = resDeital.specialtyDesc
            this.formData.tuition = resDeital.tuition
            this.formData.costNumber = resDeital.costNumber
            this.formData.classAddr = resDeital.classAddr
            this.formData.contactNumber = resDeital.contactNumber
            this.formData.quotaNumber = resDeital.quotaNumber
            this.formData.classTime = resDeital.classTime
          } else {
            this.$message.error(res.data.desc)
          }
        })
        .catch(err => console.error(err))
    },
    // 根据工种查询教材信息
    getSpecialtyTextbooks (id) {
      this.$ajax({
        method: 'GET',
        url: 'baseInfo/parameter/getSpecialtyTextbooks/' + id,
        data: null
      })
        .then(res => {
          if (res.data.code > 0) {
            this.formData.classTextbookList = res.data.list || []
          } else {
            this.$message.error(res.data.desc)
          }
        })
        .catch(err => console.error(err))
    },
    getNextTern () {
      // 编辑状态 不允许修改第一页内容
      // 年度+性质代码+类别代码+工种代码+ - +日期+序号，eg：2018+1+001+004+-+0822+01，
      if (!this.formData.specialty) return false
      if (this.id) return false
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/setUp/getNextTern',
        data: { specialty: this.formData.specialty }
      })
        .then(res => {
          if (res.data.code > 0) {
            this.formData.tern = res.data.data
          } else {
            this.$message.error(res.data.desc)
          }
        })
        .catch(err => console.error(err))
    },
    // 移除教材
    removeBook (item) {
      let oldBooks = this.formData.classTextbookList
      let bookIdx = this.$api.getItemIndex(oldBooks, item.textbookId, 'textbookId')
      if (bookIdx !== -1) {
        oldBooks.splice(bookIdx, 1)
      } else {
        console.error('未找到您要删除的教材ID!')
      }
    },
    // 添加教材
    getBooks (items) {
      let oldBooks = this.formData.classTextbookList
      items.map(book => {
        book.textbookId = book.id
        let bookIdx = this.$api.getItemIndex(oldBooks, book.textbookId, 'textbookId')
        if (bookIdx === -1) {
          oldBooks.push(book)
        }
      })
      this.bookDialogVisable = false
      console.log('添加教材完毕，已经自动过滤重复教材！')
    },
    upAreaChange (label) {
      this.formData.registrationSiteName = label
      this.formData.registrationSite = this.formData.upArea.join(',')
    },
    levelChange (id) {
      if (!id) return
      this.levelName = this.getLabel(this.paraTree.level, id, 'id', 'paraValue')
    },
    // 班级性质 变化
    natureChange (id) {
      if (!id) return
      this.showInfoData.natureName = this.getLabel(this.natureNameList, id, 'id', 'paraValue')
      if (id === 1) {
        this.formData.jointUnit = null
      }
    },
    // 开班地点
    classAddrChange (label) {
      this.formData.classAddrName = label
    },

    // 移除某一项 公用
    removeListItem (idx, listNa) {
      this.formData[listNa].splice(idx, 1)
    },
    // 上一步
    lastStep (step) {
      this.step = step
    },
    // 下一步
    nextStep (step) {
      let formName = 'ruleForm' + (step - 1)
      this.$refs[formName].validate((valid, obj) => {
        if (valid) {
          if (step === 3) {
            this.$confirm('确认提交开班申请?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                this.submitForm2(() => {
                  this.$api.extend(this.showInfoData, this.formData)
                  this.showInfoData2 = JSON.parse(JSON.stringify(this.showInfoData))
                  this.step = step
                })
              })
          }
          if (step === 2) {
            this.step = step
            let date = new Date()
            let month = date.getMonth() + 1
            let day = date.getDate()
            let categoryParaCode = null
            let specialtyParaCode = null
            this.paraTree.category.map(it => {
              if (it.id === this.formData.category) {
                categoryParaCode = it.paraCode
                it.sonList.map(son => {
                  if (son.id === this.formData.specialty) {
                    specialtyParaCode = son.paraCode
                  }
                })
              }
            })

            if (!categoryParaCode || !specialtyParaCode) {
              console.error('班级代码组装失败！')
              return false
            }
            this.formData.classCode = this.formData.year +
              this.formData.nature +
              categoryParaCode +
              specialtyParaCode +
              this.$api.toFloatString(this.formData.tern, 2)
          }
        } else {
          this.$message.error('请检查填写情况！')
          return false
        }
      })
    },
    submitForm2 (cb) {
      // 时间戳的互相转换
      let sendData = JSON.parse(JSON.stringify(this.formData))
      delete sendData.upArea
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/setUp/saveSetupClassInfo',
        data: sendData
      }).then(res => {
        if (res.data.code > 0) {
          this.classNumber = res.data.data
          cb()
          this.$message.success('提交成功！')
        }
      })
        .catch(err => console.log(err))
    },
    /**
     * 根据值找label
     * @param {*} arr
     * @param {*} val
     * @param {*} valNa
     * @param {*} labNa
     */
    getLabel (arr, val, valNa = 'id', labNa = 'paraValue') {
      if (!arr.length) {
        console.info('please check arr.length')
        return 0
      }
      let labelValue = null
      for (let i = 0; i < arr.length; i++) {
        if (arr[i][valNa] === val) {
          labelValue = arr[i][labNa]
        }
      }
      return labelValue
    },

    // 联办单位 表单验证
    checkjointUnit (rule, value, callback) {
      if (this.formData.nature !== 2) {
        callback()
      }
      if (!value) {
        callback(new Error('必填!'))
      } else {
        callback()
      }
    },
    // 表单验证 日期逻辑
    checkStartDate (rule, value, callback) {
      let sd = this.formData.startDate
      let ed = this.formData.endDate
      if (sd && ed && new Date(sd).getTime() >= new Date(ed).getTime()) {
        callback(new Error('开班日期晚于结业日期，请重新输入。'))
      } else {
        callback()
      }
    },
    // 表单验证 日期逻辑
    checkSignUpDate (rule, value, callback) {
      let ed = this.formData.endDate
      let sued = this.formData.closingUpDate
      if (sued && ed && new Date(sued).getTime() >= new Date(ed).getTime()) {
        callback(new Error('截止报名日期晚于结业日期，请重新输入。'))
      } else {
        callback()
      }
    },
    // 表单验证 日期逻辑
    checkDateLogic (rule, value, callback) {
      let sd = this.formData.startDate
      let ed = this.formData.endDate
      let sued = this.formData.closingUpDate
      if ((sd && ed) || (sued && ed)) {
        if (sd && new Date(sd).getTime() >= new Date(ed).getTime()) {
          callback(new Error('开班日期晚于结业日期，请重新输入。'))
        } else if (sued && new Date(sued).getTime() >= new Date(ed).getTime()) {
          callback(new Error('截止报名日期晚于结业日期，请重新输入。'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
  },
  created () {
    this.id = this.$route.params.id
    this.specialty = this.$route.query.specialty
    // 编辑
    if (this.id !== undefined) {
      this.initDataById()
    }
    // 根据工种新开班
    if (this.specialty !== undefined) {
      this.initDataBySpecialty()
    }
    if (this.id === undefined && this.specialty === undefined) {
      this.initData()
      this.getParaTree()
    }
  }
}
