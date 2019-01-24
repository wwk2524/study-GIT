<template>
      <el-select
      :size="size"
      :placeholder="placeholder"
      style="width:200px"
      :clearable="clearable"
      :multiple="multiple"
      v-model="startYear"
      @change="selectChange"
      >
      <el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in optionList">
      </el-option>
    </el-select>
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: 'medium'
    },
    placeholder: {
      type: String,
      default: '请选择上课时间'
    },
    clearable: {
      type: Boolean,
      default: true
    },
    optionLen: {
      type: Number,
      default: 10
    },
    multiple: {
      type: Boolean,
      default: false
    },
    value: {
      require: true,
      type: [String, Number]
    }
  },
  data () {
    return {
      optionList: [],
      startYear: null
    }
  },
  watch: {
    value () {
      this.startYear = this.value
    }
  },
  methods: {
    selectChange (v) {
      this.$emit('input', v)
      this.$emit('change', v)
    },
    getOptions () {
      let thisYear = new Date().getFullYear()
      let num = 0
      while (num < this.optionLen) {
        this.optionList.push({label: thisYear + num, value: (thisYear + num).toString()})
        num++
      }
    }
  },
  created () {
    this.getOptions()
  }
}
</script>

