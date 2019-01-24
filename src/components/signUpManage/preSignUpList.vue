<template>
  <div class="ins-container">
    <div class="ins-page-top">
        <!-- page title -->
        <div class="ins-page-title">
          学籍登记
        </div>
        <div class="ins-tab-label">
          <el-tabs v-model="page" >
            <el-tab-pane label="未登记" name="notRegistered">未登记</el-tab-pane>
            <el-tab-pane label="已登记" name="registered">已登记</el-tab-pane>
          </el-tabs>
        </div>
    </div>
    <!-- 页面主体 -->
    <div class="ins-page-con">
      <!-- <router-view></router-view> -->
      <not-registered v-if="page==='notRegistered'"></not-registered>
      <registered v-if="page==='registered'"></registered>
    </div>
  </div>
</template>
<style scoped>
.operating {
  cursor: pointer;
}
.ins-table {
  padding-top: 0px;
}
</style>
<script src='./js/preSignUpList.js'></script>

