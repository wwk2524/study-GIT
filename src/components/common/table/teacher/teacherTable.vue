<template>
    <el-table
              ref="teachertable"
                :data="tableData"
                style="width: 100%"
                @selection-change="selectChange">
                <el-table-column type="selection" width="55"> </el-table-column>
                <el-table-column v-for="(v,i) in column" :key="i" :label="v.label" :prop="v.prop" ></el-table-column>
              </el-table>
</template>

<script src="./teacherTable.js"></script>
