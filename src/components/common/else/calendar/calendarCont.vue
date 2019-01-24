<template>
<div class="handlearea" @click= "clickHdarea"
>
    <div
    v-for="(cell, cIdx) in curSelects" :key="cIdx"
    :class="['ca-cell','ca-seld']"
    :style="{height:cHei+'px',width:cWid+'px','line-height':cHei+'px',top:cell.y+'px',left:cell.x+'px'}"
    @click="delSelect(cIdx)"
    >
        {{cell.x +'-'+ cell.y}}
    </div>


    
</div>
</template>
<style scoped>
.handlearea{
    width:100%;
    height: 100%;
    position: absolute;
    top:0;
    left:0;
}

.handlearea .ca-cell {
    position: absolute;
    z-index: 1;
    padding: 4px 8px;
    border: 1px solid transparent;
    background-color: #fff;
    box-sizing: border-box;
}
/* 选中 */
.handlearea .ca-seld{
  border-color: #409eff;
}
.handlearea .ca-disabd{
  cursor: not-allowed;
}
.handlearea .ca-succ{
  background-color:#E6A23C;
}
.handlearea .ca-danger{
  background-color:#F56C6C;
}
.handlearea .ca-info{
  background-color:#909399;
}
.handlearea .ca-warn{
  background-color:#E6A23C;
}
</style>

<script src="./calendarCont.js"></script>

