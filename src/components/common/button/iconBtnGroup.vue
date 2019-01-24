<template>
  <div class="icon-btn-group">
    <i :class="this.removeIcon" @click="remove" v-if="len !== 0 && idx !== undefined"></i>
    <i :class="this.plusIcon" @click="plus" v-if="(len === 0 &&  idx === undefined) || idx === len-1"></i>
  </div>
</template>
<script>
// 业务解释
//  长度为0 只显示+
// idx 小于 长度 只显示 -
// idx 等于 长度 都显示
export default {
  props: {
    removeIcon: {
      type: String,
      default: 'el-icon-remove'
    },
    plusIcon: {
      type: String,
      default: 'el-icon-circle-plus'
    },
    idx: {
      type: Number
    },
    len: {
      type: Number,
      default: 0
    },
    param: {
      type: String
    }
  },
  data () {
    return {}
  },
  methods: {
    remove () {
      this.$emit('remove', this.idx, this.param)
    },
    plus () {
      this.$emit('plus', this.idx, this.param)
    }
  }
}
</script>

<style scoped>
.icon-btn-group {
  width: 50px;
}
.icon-btn-group [class*="el-icon-"] {
  font-size: 18px;
  cursor: pointer;
}
</style>

