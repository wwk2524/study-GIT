<template>
  <el-dialog
    title="添加教材"
    :visible.sync="showDialog"
    :before-close="cancel"
    width="50%"
    >
        <el-row style="text-align:right">
        <el-input size="small" v-model="query.query" placeholder="输入关键字 如：教材代码/教材名称" style="width:250px"></el-input>
        <el-button size="small" type="primary" @click="getTableData"><span class="el-icon-search ins-s-mr-10"></span>查询</el-button>
        <el-button size="small" type="primary" @click="resetSearch">重置</el-button>
      </el-row>
      <br>
      <el-table ref="bookListTable" :data="tableData" border height="100%" id="tab"  stripe style="height:100%;width:100%;" @selection-change="getSelections">
          <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="textbookCode" label="教材代码"></el-table-column>
        <el-table-column prop="textbookName" label="教材名称"></el-table-column>
      </el-table>
      <el-pagination  style="margin-top:12px" :current-page="query.page" :page-size="query.size" :page-sizes="sizeArr" :total="total" @current-change="pageChange" @size-change="sizeChange" layout="total, sizes, prev, pager, next, jumper"></el-pagination>

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="ensureAdd">确定添加</el-button>
    </span>
  </el-dialog>
</template>
<script src="./bookList.js"></script>
