export default {
    props: {
        studentRefundId: {
            type: String
        },
        studentCode: {
            type: String
        },
        isEdit: {
            default: false
        }
    },
    data() {
        return {
            query: null,
            studentInfo: {},
            studentInfoRule: {
                deductions: [{ pattern: /^[0-9]+$/, message: '输入不合法', trigger: 'blur' }],
                remark: [{ max: 20, message: '不能超过20个字节！', trigger: 'blur' }]
            },
            showInfo: false,
            studentTypeLabels: ['', '预报名', '已报名', '在读', '结业', '退费', '意向', '已调班', '当前班级', '再次调班']
        }
    },
    watch: {
        studentCode(nv, ov) {
            this.getStudentInfo()
        }
    },
    methods: {
        getStudentInfo() {
            this.showInfo = false
            this.studentInfo = {}
            let sendData = {}
            this.studentCode && (sendData.studentCode = this.studentCode)
            this.studentRefundId && (sendData.studentRefundId = this.studentRefundId)
            if (!this.studentCode && !this.studentRefundId) {
                return false
            }
            this.$ajax({
                method: 'POST',
                url: 'baseInfo/studentRefund/findStudentRefundDetail',
                data: sendData
            }).then(res => {
                if (res.data.code > 0) {
                    if (res.data.data) {
                        this.studentInfo = res.data.data || {}
                        this.showInfo = true
                        if(this.studentInfo.studentRefundId){
                            // 如果已经退费 不允许修改
                            this.$emit('cancel')
                        }
                    } else {
                        this.$message.info('没有查询到相关信息，请重新输入！')
                    }
                } else {
                    this.$message.error(res.data.desc)
                }
            })
                .catch(err => console.log(err))
        },

        // 确定退费
        ensureAddRefund() {
            if (this.$refs.studentInfo) {
                this.$refs.studentInfo.validate((valid, obj) => {
                    if (valid) {
                        this.submit()
                    } else {
                        this.$message('检查输入情况！')
                    }
                })
            }
        },
        submit() {
            let sendData = {
                "classStudentId": null,
                "classId": null,
                "studentId": null,
                "invoiceIsReturn": null,
                "courseNumber": null,
                "deductions": null,
                "remark": null,
                "tuition": null
            }
            this.$api.receiveExtend(sendData, this.studentInfo)
            sendData.totalDeductions = this.getTotal()
            let studentId = this.studentInfo.studentId
            let classId = this.studentInfo.classId

            sendData.studentTextbooks = []
            this.studentInfo.studentTextbooks.map(item => {
                if (parseInt(item.textbookStatus) === 1) {
                    sendData.studentTextbooks.push({
                        id: item.id,
                        studentId,
                        classId,
                        textbookId: item.textbookId
                    })
                }

            })
            this.$ajax({
                method: 'POST',
                url: 'baseInfo/studentRefund/addStudentRefund',
                data: sendData
            }).then(res => {
                if (res.data.code > 0) {
                    this.$message.success('操作成功！')
                    this.$router.push('/finance/refund')
                } else {
                    this.$message.error(res.data.desc)
                }
            })
                .catch(err => console.log(err))
        },
        // 未退费书籍
        getBooks() {
            let names = []
            let usedBooksCharge = 0
            if (!this.studentInfo.studentTextbooks) {
                return false
            }
            this.studentInfo.studentTextbooks.map(item => {
                if (parseInt(item.textbookStatus) === 0) {
                    names.push(item.textbookName)
                    usedBooksCharge += item.textbookPrice
                }
            })
            return {
                usedBooksName: names.join(','),
                usedBooksCharge
            }
        },
        cancel() {
            this.$emit('cancel')
        },
        // 退费总计
        getTotal() {
            return this.studentInfo.tuition - this.studentInfo.deductions - this.getBooks().usedBooksCharge
        }
    },
    created() {
        this.getStudentInfo()
    }
}