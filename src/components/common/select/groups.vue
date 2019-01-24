<template>
      <el-select
      :size="size"
      :placeholder="placeholder"
      style="width:150px"
      :clearable="clearable"
      v-model="groups"
      :disabled="disabled"
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
      default: '请选择'
    },
    clearable: {
      type: Boolean,
      default: true
    },
    value: {
      require: true,
      type: [Number, String]
    },
    disabled: {
      type: Boolean
    }
  },
  data () {
    return {
      optionList: [],
      groups: null
    }
  },
  watch: {
    value () {
      this.groups = this.value
    }
  },
  methods: {
    selectChange (v) {
      this.$emit('input', v)
    }
  },
  created () {
    let i = 1
    while (i < 21) {
      this.optionList.push({ value: i, label: i })
      i++
    }
    this.groups = this.value
  }
}
</script>
