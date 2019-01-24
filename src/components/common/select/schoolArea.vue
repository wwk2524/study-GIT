<template>
    <el-select
      :size="size"
      :placeholder="placeholder"
      :width="width"
      :clearable="clearable"
      :collapse-tags="collapseTags"
      :multiple="multiple"
      v-model="schoolArea"
      :disabled="disabled"
      @change="selectChange"
      >
        <el-option :key="item.id" :label="item.paraValue" :value="item.id" v-for="item in optionList">
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
    value: {
      type: [String, Number, Array]
    },
    placeholder: {
      type: String,
      default: '请选择开班地点'
    },
    clearable: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    collapseTags: {
      type: Boolean,
      default: true
    },
    width: {
      type: String,
      default: '200px'
    }
  },
  data () {
    return {
      schoolArea: this.multiple
        ? JSON.parse(JSON.stringify(this.value || []))
        : this.value || null,
      // schoolArea: this.value,
      optionList: []
    }
  },
  watch: {
    value: {
      handler (nv, ov) {
        this.schoolArea = typeof nv === 'string' ? nv : JSON.parse(JSON.stringify(nv))
        if (this.multiple) {
          let labels = []
          nv.map(item => {
            let label = this.$api.getLabel(
              this.optionList,
              item,
              'id',
              'paraValue'
            )
            if (label) {
              labels.push(label)
            }
          })
          this.$emit('getLabel', labels.join(','))
        } else {
          this.$emit(
            'getLabel',
            this.$api.getLabel(this.optionList, nv, 'id', 'paraValue')
          )
        }
      },
      deep: true
    }
  },
  methods: {
    selectChange (v) {
      // 抛出值
      this.$emit('input', JSON.parse(JSON.stringify(v)))
      // 抛出label值
      if (this.multiple) {
        let labels = []
        v.map(item => {
          let label = this.$api.getLabel(
            this.optionList,
            item,
            'id',
            'paraValue'
          )
          if (label) {
            labels.push(label)
          }
        })
        this.$emit('getLabel', labels.join(','))
      } else {
        this.$emit(
          'getLabel',
          this.$api.getLabel(this.optionList, v, 'id', 'paraValue')
        )
      }
    },
    // 类别 category 级别level 校区 schoolArea 报名地点 signUpAddress
    getParaTree () {
      this.$ajax({
        method: 'POST',
        url: 'baseInfo/parameter/getParaTree',
        data: { paraNames: ['schoolArea'] }
      })
        .then(res => {
          if (res.data.code > 0) {
            this.optionList = res.data.data.schoolArea
          } else {
            this.$message.error(res.data.desc)
          }
        })
        .catch(err => console.log(err))
    }
  },
  created () {
    this.getParaTree()
  }
}
</script>

