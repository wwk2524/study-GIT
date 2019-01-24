<template>
    <el-select :size="size" :placeholder="placeholder" style="width:150px" :clearable="clearable" :collapse-tags="collapseTags" :multiple="multiple" v-model="roleValue" @change="selectAll">
        <el-option :key="item.id" :label="item.roleName" :value="item.id" v-for="item in roleOptions">
        </el-option>
    </el-select>
</template>
<script>
    // 该组件 默认多选
    // 添加了全选功能
    export default {
      props: {
        size: {
          type: String,
          default: 'medium'
        },
        value: {
          type: [Number, Array, String]
        },
        placeholder: {
          type: String,
          default: '请选择角色'
        },
        clearable: {
          type: Boolean,
          default: true
        },
        multiple: {
          type: Boolean,
          default: false
        },
        collapseTags: {
          type: Boolean,
          default: true
        }
      },
      data () {
        return {
                // size: "medium",
                // value: [],
                // placeholder: "请选择角色",
                // clearable: true,
                // multiple: false,
                // collapseTags: true,

          roleOptions: [],
          roleValue: [],
          oldRoleValue: []
        }
      },
      watch: {
        roleValue () {},
        value: {
          handler (nv, ov) {
            if (this.value === '') {
              this.roleValue = ''
            }
            if (!this.multiple) return false
                    // 判断是否处于全选状态
            if (nv.length === this.roleOptions.length - 1) { nv.push(-1) }
            this.roleValue = this.oldRoleValue[0] = nv
          },
          deep: true
        }
      },
      methods: {
        init () {
          if (this.multiple) {
            this.oldRoleValue[0] = this.roleValue = JSON.parse(
                        JSON.stringify(this.value)
                    )
            this.selectAll(this.roleValue)
          } else {
            this.roleValue = JSON.parse(
                        JSON.stringify(this.value)
                    )
          }
        },
        getOptions () {
          this.$ajax({
            method: 'POST',
            url: 'baseInfo/roleController/findRoleList',
            data: null,
            headers: { post: { 'Content-Type': 'application/json' } }
          })
                    .then(res => {
                      if (res.data.code === 1) {
                        this.roleOptions = res.data.list
                        if (this.multiple) {
                          this.roleOptions.unshift({ id: -1, roleName: '全部' })
                        }
                      } else {
                        this.roleOptions = []
                      }
                    })
                    .catch(err => console.log(err))
        },
        selectAll (val) {
          if (this.multiple) {
            let allValues = []
                    // 保留所有值
            for (let item of this.roleOptions) {
              allValues.push(item.id)
            }
            const oldVal =
                        this.oldRoleValue.length === 1 ? this.oldRoleValue[0] : []
            if (!oldVal.includes(-1) && val.includes(-1)) {
              this.roleValue = allValues
            }
            if (oldVal.includes(-1) && !val.includes(-1)) this.roleValue = []
            if (oldVal.includes(-1) && val.includes(-1)) {
              const index = val.indexOf(-1)
              val.splice(index, 1) // 排除全选选项
              this.roleValue = val
            }
            if (!oldVal.includes(-1) && !val.includes(-1)) {
              if (val.length === allValues.length - 1) this.roleValue = allValues
            }
            this.oldRoleValue[0] = this.roleValue
                    // 去除-1
            let backValues = JSON.parse(JSON.stringify(this.roleValue))
            this.$api.removeArrayItem(backValues, -1)
            this.$emit('input', backValues)
          } else {
            this.$emit('input', val)
          }
        }
      },
      created () {
        this.getOptions()
        this.init()
      }
    }
</script>
