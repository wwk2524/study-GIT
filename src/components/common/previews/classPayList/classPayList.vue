<template>
    <div>
        <!-- <div v-for="(item,idx) in classPayList" :key="'t'+idx" class="tf-infowarp">
            <div class="t-title">{{item.teacherName}}<span class="m-left"></span> <span class="m-right">0元</span></div>
            <div ><span class="m-left">理论课酬（标准：{{item.lilunPrice}}元/节）</span> <span class="m-right">{{item.lilunPrice}}x{{item.lilunNo}}={{item.lilunPrice*item.lilunNo}}元</span></div>
            <div ><span class="m-left"></span>实操课酬（标准：{{item.shicaoPrice}}元/节<span class="m-right">{{item.shicaoPrice}}x{{item.shicaoNo}}={{item.shicaoPrice*item.shicaoNo}}元</span></div>
            <div ><span class="m-left"></span>补助金额<span class="m-right"></span>{{item.buzhujin}}元</div>
            <div ><span class="m-left"></span>备注<span class="m-right">{{item.mark}}</span></div>
        </div> -->
    </div>
</template>
<style scoped>
.tf-infowarp{
    padding: 0 12px;
    margin-top:20px;
    line-height: 26px;
}
.tf-infowarp div .m-right{
    float: right;
}
</style>
<script src="./classPayList.js"></script>
