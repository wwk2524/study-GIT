<template>
  <div class="ca-scale">
    <div v-for="(item, key) in scaleRows" :key="key" :class="['ca-cell', 'scale-cell']" :style="{height:cHei+'px',width:cWid+'px','line-height':cHei+'px'}" >
      {{item.scaleVal}}
    </div>
  </div>
</template>
<style scoped>
.ca-scale .ca-cell {
  box-sizing: border-box;
  padding: 8px 12px;
  border-left: 1px solid #e4e7ed;
  border-bottom: 1px solid #e4e7ed;
  border-right: 1px solid #e4e7ed;
  text-align: right;
  color: #8C94A8;
}
</style>

<script src="./calendarScale.js"></script>

