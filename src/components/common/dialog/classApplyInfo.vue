<template>
  <div class="appinfo">
    <el-row>
      <el-col :span="10"><span class="el-form-item__label">开班年度:</span><span class="el-form-item__content">{{value.year}}</span></el-col>
      <el-col :span="7" v-if="value.jointUnit"><span class="el-form-item__label">联办单位:</span><span class="el-form-item__content">{{value.jointUnit}}</span></el-col>
      <el-col :span="7"><span class="el-form-item__label">联系人:</span><span class="el-form-item__content">{{value.classTeacher}}</span></el-col>
    </el-row>
    <el-row>
      <el-col :span="10"><span class="el-form-item__label">报名地点:</span><span class="el-form-item__content">{{value.registrationSiteName}}</span></el-col>
      <el-col :span="7"><span class="el-form-item__label">学费标准:</span><span class="el-form-item__content">{{value.tuition}}</span></el-col>
      <el-col :span="7"><span class="el-form-item__label">工种:</span><span class="el-form-item__content">{{value.specialtyName}}</span></el-col>
    </el-row>
    <el-row>
      <el-col :span="10"><span class="el-form-item__label">联系电话:</span><span class="el-form-item__content">{{value.contactNumber}}</span></el-col>
      <el-col :span="7"><span class="el-form-item__label">限额人数:</span><span class="el-form-item__content">{{value.quotaNumber}}</span></el-col>
      <el-col :span="7"><span class="el-form-item__label">类别:</span><span class="el-form-item__content">{{value.categoryName}}</span></el-col>
    </el-row>
    <el-row>
      <el-col :span="10"><span class="el-form-item__label">成本人数:</span><span class="el-form-item__content">{{value.costNumber}}</span></el-col>
      <el-col :span="7"><span class="el-form-item__label">上课地点:</span><span class="el-form-item__content">{{value.classAddrName}}</span></el-col>
      <el-col :span="7"><span class="el-form-item__label">性质:</span><span class="el-form-item__content">{{value.natureName}}</span></el-col>
    </el-row>
    <el-row>
      <el-col :span="10"><span class="el-form-item__label">开班日期:</span><span class="el-form-item__content">{{$api.getDateAll(value.startDate)}}</span></el-col>
      <el-col :span="7"><span class="el-form-item__label">结业日期:</span><span class="el-form-item__content">{{$api.getDateAll(value.endDate)}}</span></el-col>
      <el-col :span="7"><span class="el-form-item__label">截止报名日期:</span><span class="el-form-item__content">{{$api.getDateAll(value.closingUpDate)}}</span></el-col>
    </el-row>
    <el-row style="color:#F56C6C;" v-show="value.delayStartDate">
      <el-col :span="10"><span class="el-form-item__label">延迟至：</span><span class="el-form-item__content">{{$api.getDateAll(value.delayStartDate)}}</span></el-col>
      <el-col :span="7"><span class="el-form-item__label">延迟至：</span><span class="el-form-item__content">{{$api.getDateAll(value.delayEndDate)}}</span></el-col>
      <el-col :span="7"><span class="el-form-item__label">延迟至：</span><span class="el-form-item__content">{{$api.getDateAll(value.delayClosingUpDate)}}</span></el-col>
    </el-row>
    <el-row>
      <!-- <el-col :span="7"><span class="el-form-item__label">审批流程:</span><span class="el-form-item__content">{{value.processName}}</span></el-col> -->
      <el-col :span="10"><span class="el-form-item__label">上课时间:</span><span class="el-form-item__content">{{value.classTime}}</span></el-col>
      <el-col :span="7"><span class="el-form-item__label">最低排课人数:</span><span class="el-form-item__content">{{value.minimumNumber}}</span></el-col>
      <el-col :span="7">
        <span class="el-form-item__label">教材信息:</span>
        <div class="info_content" style="padding-left: 100px;">
          <p v-for="(item,idx) in value.bookList || value.classTextbookList" :key="idx">{{item.textbookName}}</p>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="14">
        <span class="el-form-item__label" style="display:block;width: 100%;text-align: left;">工种简介:</span>
        <div class="info_content">{{value.specialtyDesc || value.classDesc}}</div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
    }
  }
}
</script>
<style scoped>
.info_content{
  width:600px;
  margin-top: 35px;
  text-align: left;
  color: #606266;
}
.info_content p{
  margin-top: 6px;
}
</style>
