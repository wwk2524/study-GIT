<template>
  <div class="ca-head">
    <div v-for="(item, key) in curWeekInfo" :key="key"
    :class="['ca-cell', 'head-cell',{'btm-line':item.mark}]"
    :style="{width:cWid+'px',height:cHei+'px'}">
      <div class="text-center">{{item.weekName}}</div>
      <div class="text-center">{{item.dateName}}</div>
    </div>
 {{curWeekInfo}}
  </div>
</template>
<style scoped>
.ca-head {
  font-size: 0;
  background: #007EF3;
  color: #fff;
}
.ca-head .ca-cell {
  display: inline-block;
  box-sizing: border-box;
  padding: 4px 12px;
  font-size: 14px;
  border-right: 1px solid #e4e7ed;
  border-bottom: 1px solid #e4e7ed;
  border-top: 1px solid #e4e7ed;
  position: relative;
}
.head-cell{
  border-top: 1px solid #e4e7ed;
}
.ca-head .ca-cell.btm-line::after {
  content: " ";
  position: absolute;
  display: block;
  height: 3px;
  width: 100%;
  bottom: 0;
  left:0;
  background-color:#F56C6C;
}
</style>


<script src="./calendarHead.js"></script>

