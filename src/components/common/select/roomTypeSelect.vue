<template>
      <el-select
      :size='size'
      :placeholder='placeholder'
      style='width:200px'
      :clearable='clearable'
      :multiple='multiple'
      :collapse-tags="collapseTags"
      v-model='componentValue'
      @change='selectChange'
      >
      <el-option :key='item.id' :label='item.paraValue' :value='item.id' v-for='item in optionList'>
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
      default: '请选择教室类型'
    },
    clearable: {
      type: Boolean,
      default: true
    },
    optionLen: {
      type: Number,
      default: 10
    },
    collapseTags: {
      type: Boolean,
      default: true
    },
    multiple: {
      type: Boolean,
      default: false
    },
    value: {
      require: true,
      type: [String, Number, Array]
    }
  },
  data () {
    return {
      optionList: [],
      componentValue: this.multiple ? JSON.parse(JSON.stringify(this.value)) : this.value
    }
  },
  watch: {
    value: {
      handler (nv, ov) {
        this.componentValue = this.multiple ? JSON.parse(JSON.stringify(nv)) : nv
      },
      deep: true
    }
  },
  methods: {
    selectChange (v) {
      this.$emit('input', v)
      this.$emit('change', v)
    },
    getOptions () {
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/parameter/getParaTree',
        data: {
          paraNames: ['classRoomType'],
          inactive: 1
        }
      })
        .then(res => {
          if (res.data.code > 0) {
            this.optionList = res.data.data.classRoomType
          } else {
            this.$message.error(res.data.desc)
          }
        })
        .catch(err => console.log(err))
    }
  },
  created () {
    this.getOptions()
  }
}
</script>

