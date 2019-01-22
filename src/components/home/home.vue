
<template>
<el-container>
  <el-header>
    {{defaultActive}}
      <el-button type="primary" plain @click="collapse = !collapse">show/hide menus</el-button>
      <el-button type="primary" plain @click="getMenus">reGetMenus</el-button>
      <el-button type="success" plain v-for="(v,i) in [1,2,3]" :key="i" @click="changeMeuns(i)">{{v}}</el-button>
  </el-header>
  <el-container>
    <el-aside width="auto">
      <el-menu 
:default-active="defaultActive"
:default-openeds="defaultOpeneds"
      :router="true"
:collapse="collapse"
      >
        <div v-for="(m,seq) in leftMenu" :key="seq" class="my-menu">
        <el-submenu v-if="m.children != null" :key="seq" :index="seq.toString()">
          <template slot="title">
            <i :class="'el-icon-' + m.icon"></i>
            <span slot="title">{{m.name}}</span>
            </template>
            <el-menu-item v-for="(sub, sseq) in m.children" :index="sub.route" :key="sseq">
              <i :class="'el-icon-' + sub.icon"></i>
              <span slot="title">{{sub.name}}</span>
            </el-menu-item>
        </el-submenu>
        <el-menu-item v-else :index="m.route">
          <i :class="'el-icon-' + m.icon"></i>
          <span>{{m.name}}</span>
        </el-menu-item>
        </div>
      </el-menu>
    </el-aside>
    
    <el-main>
       <div v-if="accessGranted">
        <router-view></router-view>
      </div>
      <div v-else>
        <div v-if="loggingIn">
          登入中...
        </div>
        <div v-else>
          对不起，您没有系统权限！
        </div>
      </div>
    </el-main>
  </el-container>
</el-container>

</template>

<script>
// 要解决的问题
// 1 默认跳转到第一个路径
// 2 让菜单标志被选中的菜单
function getItemHaveKey(oArr, keyNa, childNa) {
  for(let i = 0; i<oArr.length;i++){
    if(oArr[i][keyNa]){
      return oArr[i]
    }
    let cArr = oArr[i][childNa]
    if(cArr && cArr.length){
      return getItemHaveKey(cArr,keyNa,childNa)
    }
  }
}
import api from "@/api/common/account.js";
export default {
  name: "home",
  data() {
    return {
      collapse: false,
      defaultActive: null,
      defaultOpeneds: ['1','2','3','4'],
      allMeuns: null,

      context: null,
      leftMenu: null,
      accessGranted: false,
      loggingIn: true
    };
  },
  methods: {
    changeMeuns(i) {
      this.leftMenu = this.allMeuns[i]
      this.defaultActiveMenu()
    },
    defaultActiveMenu() {
      let menuItem = getItemHaveKey(this.leftMenu,'route','children')
      this.$router.push(menuItem.route)
      this.defaultActive = menuItem.route

console.log(menuItem)
    },
    getMenus() {
      api.getMenus().then(res => {
        if (res.success) {
          this.allMeuns = res.data;
          this.changeMeuns(0);
        } else {
          this.$message.error(requst.message, 3);
        }
      });
    }
  },
  created() {
    this.getMenus();
    var _this = this;
    setTimeout(function() {
      _this.loggingIn = false;
      _this.accessGranted = true;
      _this.$router.push("/welcome");
    }, 1000);

    // 转到主页
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
div.my-menu{
  min-width: 200px;
}
.el-menu--collapse>div.my-menu>.el-menu-item [class^=el-icon-], .el-menu--collapse>div.my-menu>.el-submenu>.el-submenu__title [class^=el-icon-] {
    margin: 0;
    vertical-align: middle;
    width: 24px;
    text-align: center;
}
.el-menu--collapse>div.my-menu>.el-menu-item span, .el-menu--collapse>div.my-menu>.el-submenu>.el-submenu__title span {
    height: 0;
    width: 0;
    overflow: hidden;
    visibility: hidden;
    display: inline-block;
}
.el-menu--collapse>div.my-menu>.el-menu-item .el-submenu__icon-arrow, .el-menu--collapse>div.my-menu>.el-submenu>.el-submenu__title .el-submenu__icon-arrow {
    display: none;
}
.el-menu--collapse>div.my-menu>.el-menu-item.is-active i {
    color: inherit;
}
</style>
