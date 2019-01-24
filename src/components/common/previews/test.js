export default {
    props: {
        createTime: {
            required: true
        }
    },
    data() {
        return {
            countTime: null,
            inteVal: -1
        }
    },
    methods: {
        countEquationTime() {
            if (this.inteVal !== -1) {
                clearInterval(this.inteVal)
            }
            let nTime = new Date().getTime()
            let equationTime = nTime - this.createTime
            this.inteVal = setInterval(t => {
                let h = parseInt(equationTime / (60 * 60 * 1000))
                let m = parseInt((equationTime % (60 * 60 * 1000)) / (60 * 1000))
                let s = parseInt(
                    ((equationTime % (60 * 60 * 1000)) % (60 * 100)) / 1000
                )
                this.countTime = h + ":" + m + ":" + s
            }, 1000)
        }
    },
    created() {
        this.countEquationTime()
    }
}