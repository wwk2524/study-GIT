<template>
<div class="bar">
     <el-menu :class="displyShow?'ins-start':'ins-end'" class="el-menu-vertical-demo com_fl com_h_full com_ofy_a com_ofx_h">
                     <template  v-for="(item,key) in mainMenu">
                    <div  @mouseenter.stop="openMenu(item,mainMenu)" @contextmenu.stop="context(item,$event)" :key="item.resId" @click="routerTo(item,mainMenu)">
                        <el-menu-item :class="{ 'hasChild': item.childMenus&&item.childMenus.length, 'active': item.select ,'menuSelect':item.select}" :index="(key+1).toString()">
                            <template>
                                <i :class="item.icon">
                                </i>
                                <span slot="title" v-text="item.resName">
                                </span>
                            </template>
                        </el-menu-item>
                    </div>
                    </template>
                </el-menu>
    <nav-bar v-if="index<4"  :menu="subMenu" :displyShow="subShow" :index="index+1" @context="context"></nav-bar>
</div>
</template>
<style>
.bar{
  height: 100%;
  float: left;
}
</style>
<script>
import navBar from './navBar'
export default{
  name: 'navBar',
  components: { navBar },
  props: {
    menu: {
      type: Array,
      default: [],
      required: true
    },
    displyShow: {
      type: Boolean,
      default: false
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      subMenu: [],
      show: false
    }
  },
  computed: {
    subShow: function () {
      return (this.show && this.displyShow)
    },
    mainMenu: function () {
      this.show = false
      return JSON.parse(JSON.stringify(this.menu))
    }
  },
  methods: {
    openMenu (item, list) {
      list.forEach(o => {
        if (o.resId === item.resId) {
          this.$set(o, 'select', true)
        } else {
          this.$set(o, 'select', false)
        }
      })
      if (Array.isArray(item.childMenus) && item.childMenus.length > 0) {
        this.show = true
      } else {
        this.show = false
      }
      this.$set(this, 'subMenu', (item.childMenus || []))
    },
    routerTo (item, list) {
      if (item.resUrl) {
        this.$router.push({
          path: item.resUrl
        })
      }
    },
    context (item, $event) {
      if (Array.isArray(item)) {
        this.$emit('context', item)
      } else {
        this.$emit('context', [item, $event])
      }
    }
  }
}
</script>
