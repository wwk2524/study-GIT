<template>
    <div>
        <div class="ins-page-search">
            <div class="ins-opa-btn right">
                <el-input v-model="query" size="medium" placeholder="姓名/手机号码/身份证号/班级代码" style="width:310px;margin-right: 10px;"></el-input>
                <el-button size="small" type="primary" round @click="frontFilter"><span class="el-icon-search ins-s-mr-5"></span>查询</el-button>
                <el-button size="small" type="success" round @click="resetSearch" style="margin-left: 5px;">重置</el-button>
            </div>
            <div class="ins-opa-btn">
                <el-button type="primary" size='small' icon="el-icon-circle-plus" @click="addStudent">新增学生</el-button>
            </div>
        </div>
        <div class="ins-page-main">
            <div class="ins-content-con ins-s-hf">
                <div class="ins-table pt0 divide">
                    <div class="ins-tab-con">
                        <el-table :data="tableData" border id="tab" stripe>
                            <el-table-column align="left" label="学生姓名" prop="studentName" show-overflow-tooltip sortable></el-table-column>
                            <el-table-column align="left" label="班级代码" prop="classCode" show-overflow-tooltip sortable></el-table-column>
                            <el-table-column align="left" label="手机号码" prop="studentPhone" show-overflow-tooltip sortable></el-table-column>
                            <el-table-column align="left" label="身份证号" prop="studentIdCard" show-overflow-tooltip sortable>
                                <template slot-scope="scope">
                                    <div class="excel-string">
                                        {{scope.row.studentIdCard}}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column align="left" label="是否确认" prop="isConfirm" show-overflow-tooltip sortable>
                                <template slot-scope="scope">
                                    <span>{{scope.row.isConfirm ? '已确认' : '待确认'}}</span>
                                    <!-- <el-switch v-model="scope.row.isConfirm" @change='changeSwitch(scope.row)'></el-switch> -->
                                </template>
                            </el-table-column>
                            <el-table-column align="left" label="操作" width='230px' show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <el-button type="success" plain size="mini" @click='updateInfo(scope.row)'>填写报名信息</el-button>
                                    <el-button type="danger" plain size="mini" @click='delStudent(scope.row)'>删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <!-- page divide -->
                    <div class="ins-tab-divide">
                        <el-pagination :current-page="currentPage" :page-size="size" :page-sizes="sizeArr" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script src='./js/notRegistered.js'></script>
