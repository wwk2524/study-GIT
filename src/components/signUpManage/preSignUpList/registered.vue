<template>
    <div>
        <div class="ins-page-search">
            <div class="ins-opa-btn right">
                <el-input v-model="query" size="medium" placeholder="姓名/身份证号/报名员" style="width:310px;margin-right: 10px;"></el-input>
                <el-button size="small" type="primary" round @click="frontFilter"><span class="el-icon-search ins-s-mr-5"></span>查询</el-button>
                <el-button size="small" type="success" round @click="resetSearch" style="margin-left: 5px;">重置</el-button>
            </div>
        </div>
        <div class="ins-page-main">
            <div class="ins-content-con ins-s-hf">
                <div class="ins-table divide">
                    <!-- title -->
                    <div class="ins-title">
                        <div class="ins-opa-btn right">
                            <el-tooltip popper-class="tipe" effect="light" content="导出" placement="top">
                                <el-button @click='exportRegister' size="small" plain icon="el-icon-upload2" circle></el-button>
                            </el-tooltip>
                        </div>
                    </div>
                    <div class="ins-tab-con">
                        <el-table :data="tableData" border id="tab" stripe>
                            <el-table-column align="left" label="学号" prop="studentCode" show-overflow-tooltip sortable></el-table-column>
                            <el-table-column align="left" label="工种" prop="specialty" show-overflow-tooltip sortable></el-table-column>
                            <el-table-column align="left" label="姓名" prop="studentName" show-overflow-tooltip sortable></el-table-column>
                            <el-table-column align="left" label="报名日期" prop="signupDate" show-overflow-tooltip sortable>
                                <template slot-scope="scope">
                                    {{$api.getDateAll(scope.row.signupDate,'-')}}
                                </template>
                            </el-table-column>
                            <el-table-column align="left" label="工作单位" prop="workUnit" show-overflow-tooltip sortable></el-table-column>
                            <el-table-column align="left" label="身份证号" prop="studentIdCard" show-overflow-tooltip sortable></el-table-column>
                            <el-table-column align="left" label="实收金额" prop="tuition" show-overflow-tooltip sortable>
                                <template slot-scope="scope">
                                    <span v-if='scope.row.tuition'>
                                        {{scope.row.tuition}}元
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column align="left" label="发票" prop="invoiceNum" show-overflow-tooltip sortable></el-table-column>
                            <el-table-column align="left" label="报名员" prop="teacherName" show-overflow-tooltip sortable></el-table-column>
                            <el-table-column align="left" label="操作" width='230px' show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <el-button type="success" plain size="mini" @click='selectInfo(scope.row)'>查看报名信息</el-button>
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

<script src='./js/registered.js'></script>

<style>

</style>
