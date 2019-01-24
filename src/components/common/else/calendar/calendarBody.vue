<template>
  <div class="ca-cabd" :style="{height:cHei*30+'px',width:cWid*7 + 'px'}" @click="clickHdarea">
    <!-- 背景格子 -->
    <div v-for="(row, rIdx) in calendarBody" :key="'row'+rIdx" class="cabd-row">
        <div v-for="(cell, cIdx) in row" :key="'bgcell'+cIdx"
        :class="['ca-cell',{'nomalweekend':cell.isWeekend},{'past-cell':cell.isLtToday}]"
        :style="{height:cHei+'px',width:cWid+'px','line-height':cHei+'px'}" >
        <!-- {{cell.psX +'-'+ cell.psY}} -->
        </div>
    </div>
    <slot name="plans"></slot>
  </div>
</template>
<style scoped>
.ca-cabd {
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.cabd-row {
  font-size: 0;
}
.test{
position: absolute;
    z-index: 0;
    top: 0;
    background-color: yellowgreen;
}
.cabd-row .ca-cell {
  box-sizing: border-box;
  display: inline-block;
  padding: 8px 12px;
  border-right: 1px solid #e4e7ed;
  border-bottom: 1px solid #e4e7ed;
  text-align: center;
  font-size: 14px;
  vertical-align: middle;
}
/* 普通周末 */
.nomalweekend {
  background-color: #EBEEF5;
  
}
/* 过去的时间 */
.past-cell {
  background-color: #EBEEF5;
  cursor: not-allowed;
}

</style>

<script src="./calendarBody.js"></script>

