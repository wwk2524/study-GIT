<style scoped>
.bar{
  height: 100%;
  float: left;
}
.el-menu:not(.el-menu--collapse) {
	min-height: 400px;
}
.el-menu.ins-start{
	max-width:0px;
	border-right: none;
	transition:max-width 1s;
	-moz-transition:max-width 1s; /* Firefox 4 */
	-webkit-transition:max-width 1s; /* Safari and Chrome */
	-o-transition:max-width 1s; /* Opera */
}
.el-menu.ins-end{
	border-right: solid 1px #e6e6e6;
	max-width: 300px;
}
.el-menu-item{
	padding: 0 45px 0 20px;
}
.el-menu-item.hasChild:after{
	font-family: element-icons;
	content: "\E604";
	font-size: 15px;
	color: #bfcbd9;
	position: absolute;
	right: 15px;
	font-weight:bold;
}
.el-menu-item.active,.el-menu-item.active:after,.el-menu-item.active i[class^=el-icon]{
	color: #00A4FF;
}
</style>
<template>
  	<div class="bar">
        <el-menu :class="menuShow?'ins-end':''" class="ins-start ins-s-hf ins-s-fl ins-s-ofy-a ins-s-ofx-h">
            <template  v-for="(item,key) in mainMenu">
            	<div  @mouseenter.stop="openMenu(item,mainMenu)" @contextmenu.stop="context(item,$event)" :key="key" @click="routerTo(item,mainMenu)">
					<el-menu-item :class="{ 'hasChild': item.childMenus&&item.childMenus.length, 'active': item.select}" :index="(key+1).toString()">
						<template>
							<i class="el-icon-menu"></i>
							<!-- <img v-if="item.icon&&!item.select" :src="require('../../assets/images/'+item.icon)" alt="菜单图标"> -->
							<!-- <img v-if="item.icon&&item.select" :src="require('../../assets/images/'+item.icon.split('.')[0]+'a.'+item.icon.split('.')[1])" alt="菜单图标"> -->
							<span slot="title" v-text="item.resName"></span>
						</template>
					</el-menu-item>
				</div>
            </template>
        </el-menu>
    	<nav-bar v-if="index<4"  :menu="subMenu" :menuShow="subShow" :index="index+1" @context="context"></nav-bar>
	</div>
</template>
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
	    menuShow: {
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
	      return (this.show && this.menuShow)
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
