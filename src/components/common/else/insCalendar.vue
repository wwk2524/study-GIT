<template>
  <div class="calendar-warp">
    <!-- table head -->
    <div class="tbl-head ca-row">
        <div class="head-cell ca-cell head-first" :style="{'width':cellWid + 'px'}"></div>
        <div v-for="(hItem,hIdx) in headInfo" :key="hIdx+'h'" class="head-cell ca-cell" :style="{'width':cellWid + 'px'}">
        <div>{{hItem.weekName}}</div>
        <div>{{hItem.dateName}}</div>
      </div>
    </div>
    <div class="handl-area" @click="clickArea">
      <!-- table body -->
      <div v-for="(tItem,tIdx) in timeScale" :key="tIdx + 't'"  class="ca-row" :style="{height:cellHei + 'px'}">
        <div class="ca-cell scale-cell" :style="{ top: -cellHei/2 + 'px', height:cellHei + 'px','line-height': cellHei + 'px','width':cellWid + 'px'}" >{{tItem.scaleVal}}</div>
        <div v-for="(cItem,cIdx) in tItem.rowCell" :key="cIdx" class="ca-cell" :style="{height:cellHei + 'px','line-height': cellHei + 'px','width':cellWid + 'px'}">
          </div>
      </div>

      <!-- 课程渲染 灰色背景 -->
      <div 
        v-for="(cItem, cIdx) in showClasses"
        :key="cIdx + 'c'"
        :style="{ left:cItem.x + 'px', top:cItem.y+'px',height:cItem.h +'px',width:cellWid+'px',zIndex:'50'}"
        @click="selecteClass(cItem,cIdx)"
        :class="{ 'ca-pcard': true, 'ca-nmlplan': true, 'ca-selected':cItem.s }">
          <el-popover placement="top" width="400" trigger="hover">
            <div>
              <p>班级代码:{{cItem.classCode}} </p>
              <p>工种:{{cItem.specialty}} </p>
              <p>课程类型:{{cItem.courseType === '2' ? '理论' : '实操' }}</p>
              <p>任课教师:{{cItem.lecturerName}}</p>
              <p>上课时间:{{$api.getDateAll(cItem.courseStartTime,'', 'hm') + '-' + $api.getDateAll(cItem.courseEndTime,'', 'onlyhm')}}</p>
              <p>提交审批时间：{{$api.getDateAll(cItem.createDate,'','hm')}}</p>
            </div>
            <div  slot="reference" style="width:100%;height:100%;">
              ({{getStatusLabel(parseInt(cItem.status))}}) {{cItem.specialty}} {{cItem.lecturerName}}
            </div>
          </el-popover>
          
      </div>
      <!-- 空计划 白色背景 -->
      <div v-for="(sItem, sIdx) in selectedEmptys" :key="sIdx + 's'"
      :style="{ left:sItem.x + 'px', top:sItem.y+'px',height:sItem.h +'px',width:cellWid+'px',zIndex:'75'}"
      @click="clickEPlan(sIdx)"
      class="ca-pcard ca-selected">
      <!-- {{sIdx}} -->
      </div>
       <!-- 普通占用 红色背景 -->
        <div 
          v-for="(nItem, nIdx) in showOccupys"
          :key="nIdx + 'n'"
          :style="{ left:nItem.x + 'px', top:nItem.y+'px',height:nItem.h +'px',width:cellWid+'px',zIndex:'100'}"
          @click="selectOccupy(nItem,nIdx)"
          :class="{  'ca-pcard': true, 'ca-danger': true, 'n-allow': true, 'ca-selected':nItem.s }">
            <el-popover placement="top" width="400" trigger="hover">
              <div>
                <p>占用人:{{nItem.creatorBy}} </p>
                <p>原由：{{nItem.remark}} </p>
                <p>占用时间：:{{$api.getDateAll(nItem.startTime,'', 'hm') + '-' + $api.getDateAll(nItem.endTime,'', 'onlyhm')}}</p>
              </div>
              <div  slot="reference" style="width:100%;height:100%;">
                <p>占用</p>
                <p>{{$api.getDateAll(nItem.startTime,'')}}{{nItem.remark}}</p>
              </div>
            </el-popover>
          </div>

      </div>
    </div>
</template>
<script src="./insCalendar.js"></script>
<style scoped>
.calendar-warp {
  background-color: #fff;
}

.ca-row {
  display: block;
  width: 100%;
  font-size: 0;
}
.ca-cell {
  width: 12.5%;
  display: inline-block;
  font-size: 14px;
  border-bottom: 1px solid #e4e7ed;
  border-right: 1px solid #e4e7ed;
  padding: 4px 8px;
  vertical-align: middle;
  /* box-sizing: border-box !important; */
}

.handl-area {
  position: relative;
  cursor: pointer;
}
.tbl-head {
  height: 60px;
}
.head-cell.ca-cell {
  height: 60px;
  border-top: 1px solid #e4e7ed;
}
.head-first {
  border-left: 1px solid #e4e7ed;
  border-bottom: none;
}
.handl-area .ca-row .ca-cell:first-child {
  border-left: 1px solid #e4e7ed;
}
.scale-row:first-child .ca-cell {
  border-top: 1px solid #e4e7ed;
}
.scale-cell {
  position: relative;
  text-align: right;
}
.ca-pcard {
  position: absolute;
  z-index: 500;
  padding: 4px 8px;
  border: 2px solid transparent;
  /* background-color: #ebeef5; */
}

.ca-nmlplan {
  background-color: #e4e7ed;
}
.ca-selected {
  border-color: #409eff;
}
.ca-warn {
  color: #fff;
  background-color: #e6a23c;
}
.ca-danger {
  color: #fff;
  background-color: #f56c6c;
}
.n-allow {
  cursor: not-allowed;
}
</style>


