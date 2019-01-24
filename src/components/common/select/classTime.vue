<template>
      <el-select
      :size="size"
      :placeholder="placeholder"
      style="width:150px"
      :clearable="clearable"
      :multiple="multiple"
      v-model="classTime"
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
    multiple: {
      type: Boolean,
      default: false
    },
    value: {
      require: true,
      type: String
    }
  },
  data () {
    return {
      optionList: [
        {label: '上午', value: '上午'},
        {label: '下午', value: '下午'},
        {label: '晚上', value: '晚上'}
      ],
      classTime: null
    }
  },
  watch: {
    value () {
      this.classTime = this.value
    }
  },
  methods: {
    selectChange (v) {
      this.$emit('input', v)
    }
  }
}
</script>

