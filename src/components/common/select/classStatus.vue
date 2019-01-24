<template>
      <el-select
      :size="size"
      :placeholder="placeholder"
      style="width:150px"
      :clearable="clearable"
      :multiple="multiple"
      v-model="classStatus"
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
      default: '请选择状态'
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
      type: [String]
    }
  },
  data () {
    return {
      optionList: [
        {label: '已确认', value: '0'},
        {label: '未确认', value: '1'},
        {label: '驳回', value: '2'}
      ],
      classStatus: null
    }
  },
  watch: {
    value () {
      this.classStatus = this.value
    }
  },
  methods: {
    selectChange (v) {
      this.$emit('input', v)
      this.$emit('getLabel', this.$api.getLabel(this.optionList, v, 'value', 'label'))
    }
  }
}
</script>

