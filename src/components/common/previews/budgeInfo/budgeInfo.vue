<template>
<div>
    <div style='margin:15px 0;' v-for="(cItem,idx) in chargesInfo.signupOtherCharges" :key="idx" >
      <span style='display:inline-block;width:20%'>收费标准：默认值元/人</span>
      <span style='display:inline-block;width:20%'>{{cItem.chargesName}}:{{cItem.chargesPrice}}</span>
    </div>
    <h4>理论</h4>
    <div style='overflow:hidden;font-size:12px;margin-bottom:10px;' v-for="(tItem,tIdx) in chargesInfo.signupCourseCharges" :key="tIdx" v-if="tItem.courseType === '1'">
      <div style='float:left;' >
        {{tItem.teacherType === '1' ? '主讲老师' : '辅导老师'}}：
        <span style='font-weight:bold'>{{tItem.teacherName}} ￥    {{tItem.lessonPrice}}   元/节</span>
      </div>
      <div style='float:right'>节 X /{{tItem.lessonPrice}}节 = &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;元</div>
    </div>
    <h4>实操</h4>
    <div style='overflow:hidden;font-size:12px;margin-bottom:10px;' v-for="(tItem,tIdx) in chargesInfo.signupCourseCharges" :key="tIdx" v-if="tItem.courseType === '2'">
      <div style='float:left;'>
        {{tItem.teacherType === '1' ? '主讲老师' : '辅导老师'}}：
        <span style='font-weight:bold'>{{tItem.teacherName}} ￥     {{tItem.lessonPrice}}   元/节</span>
      </div>
      <div style='float:right'>节 X /{{tItem.lessonPrice}} 节 = &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;元</div>
    </div>
    <div style='margin-top:30px;'>
      <span style='display:inline-block;width:30%;font-weight:bold;'>中心负责人：</span>
      <span style='display:inline-block;width:30%;font-weight:bold;'>部门审核：</span>
      <span style='display:inline-block;width:30%;font-weight:bold;'>班主任：</span>
    </div>
</div>
</template>
<style scoped></style>

<script src="./budgeInfo.js"></script>
