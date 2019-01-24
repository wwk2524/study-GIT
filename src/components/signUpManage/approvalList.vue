<template>
    <div class="ins-container">
        <div class="ins-page-top">
            <!-- page title -->
            <div class="ins-page-title">
              开班申请审批
            </div>
        </div>
        <!-- 页面主体 -->
        <div class="ins-page-con">
            <div class="ins-page-search">
                <div class='left mt10'>
                    <el-checkbox v-model="selectIsOk">只看未确认</el-checkbox>
                </div>
            </div>
            <div class="ins-page-main">
                <div class="ins-content-con ins-s-hf">
                    <div class="ins-table divide">
                        <!-- title -->
                        <div class="ins-title">
                            <span class='ins-'>开班申请审批</span>
                            <!-- 复制 打印 -->
                            <div class="tabbar-con">
                                <tableBar type="export,printer" tableId="tab"></tableBar>
                            </div>
                            <div class="ins-search-con right">
                                <el-input v-model="query" clearable size="medium" placeholder="请输入关键字" style="width:250px"></el-input>
                            </div>
                        </div>
                        <!-- content -->
                        <div class="ins-tab-con">
                            <el-table :data="tableData" border class='FE-pagination' id="tab" stripe style="width:100%;">
                                <el-table-column align="left" label="班级代码" prop="classCode" show-overflow-tooltip sortable>
                                    <template slot-scope="scope">
                                        <span class="ins-table-card" @click="showDetial(scope.row)">{{scope.row.classCode}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column align="left" label="性质" prop="natureName" show-overflow-tooltip sortable></el-table-column>
                                <el-table-column align="left" label="工种" prop="specialtyName" show-overflow-tooltip sortable></el-table-column>
                                <el-table-column align="left" label="上课时间" prop="classTime" width='110px' show-overflow-tooltip sortable></el-table-column>
                                <el-table-column align="left" label="开班日期" prop="startDate" show-overflow-tooltip sortable>
                                    <template slot-scope="scope">
                                        <span>{{$api.getDateAll(scope.row.startDate)}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column align="left" label="开班地点" prop="classAddrName" show-overflow-tooltip sortable></el-table-column>
                                <el-table-column align="left" label="学费标准" prop="tuition" width='110px' show-overflow-tooltip sortable></el-table-column>
                                <el-table-column align="left" label="状态" prop="approveStatus" width='100px' show-overflow-tooltip sortable>
                                    <template slot-scope="scope">
                                        <!-- approveStatus	string	审批状态（0待审批 1-同意 2-不同意 3 下一级审批） 同开班列表不同-->
                                        <span v-if="scope.row.approveStatus !== '2'" @click='selectApprovalFlow(scope.row)' class="ins-table-card">{{classStatusLabels[scope.row.approveStatus]}}</span>
                                        <span v-if="scope.row.approveStatus === '2'" @click='showTurnDown(scope.row.list)' class="ins-table-card">{{classStatusLabels[scope.row.approveStatus]}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column align="left" label="操作" class-name='operating-table-column' width='230px' show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <el-button v-if="scope.row.approveStatus === '1'" disabled plain size="mini" type="primary">已同意</el-button>
                                        <el-button v-if="scope.row.approveStatus === '2'" disabled plain size="mini" type="primary">已驳回</el-button>
                                        <el-button v-if="scope.row.approveStatus === '0'" @click="confirmBy(scope.row.id)" plain size="mini" type="primary">确认通过</el-button>
                                        <el-button @click="showDetial(scope.row)" plain size="mini" type="success">查看详情</el-button>
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
        <!-- 申请信息  :title="curClassInfo.specialtyName + curClassInfo.classCode +'详细信息'"" -->
        <el-dialog id="ClassDialog" :visible.sync="dialogVisible" class="minwiddia"  width='70%'>
            <span style="position: relative;left: 164px;top: -49px;font-size: 17px;">{{curClassInfo.classCode + curClassInfo.specialtyName }}</span>
      <!-- approveStatus	string	审批状态（0待审批 1-同意 2-不同意 3 下一级审批） 同开班列表不同-->
          <div class="info-head clear" v-if="approveStatus == '1'" >
            <div class='left'>
              <img :src="'static/images/approved0.png'" alt="">
            </div>
            <div  class="titleInfo left" v-if="isClassTeacher">
              通过开班审批！您可以去申请开课了！
                <router-link to="/startClass/list" style="color: #fff;"><el-button type="primary" size="mini">去申请开课</el-button></router-link>
            </div>
          </div>

           <div class="info-head clear" v-if="approveStatus === '3' || approveStatus === '0'" >
                <div class='left'>
                <img :src="'static/images/approved1.png'" alt="">
                </div>
            </div>

          <div class="info-head clear" v-if="approveStatus == '2'" >
            <div class='left'>
              <img :src="'static/images/approved2.png'" alt="">
            </div>
            <div  class="titleInfo left">
              <span style="color:#FF0D0D">驳回理由： </span>
               {{approveList.content}}
              <el-button type="primary" size="mini" @click="turnDownDialog">
                修改驳回意见
                </el-button>
            </div>
          </div>
            <apply-info :value="curClassInfo"></apply-info>
            <el-row v-if="approveStatus === '2'" class='appinfo mt30'>
                <el-col :span='7'><span class="el-form-item__label">申请时间：</span><span class="el-form-item__content">{{$api.getDateAll(curClassInfo.createDate,'-','hms')}}</span></el-col>
                <el-col :span='7'><span class="el-form-item__label">驳回时间：</span><span class="el-form-item__content">{{$api.getDateAll(curClassInfo.confirmDate,'-','hms')}}</span></el-col>
                <el-col :span='7'><span class="el-form-item__label">驳回人：</span><span class="el-form-item__content">{{curClassInfo.confirmPerson}}</span></el-col>
            </el-row>
            <el-row v-if="approveStatus === '1'" class='appinfo mt30'>
                <el-col :span='7'><span class="el-form-item__label">申请时间：</span><span class="el-form-item__content">{{$api.getDateAll(curClassInfo.createDate,'-','hms')}}</span></el-col>
                <el-col :span='7'><span class="el-form-item__label">通过时间：</span><span class="el-form-item__content">{{$api.getDateAll(curClassInfo.confirmDate,'-','hms')}}</span></el-col>
                <el-col :span='7'><span class="el-form-item__label">通过人：</span><span class="el-form-item__content">{{curClassInfo.confirmPerson}}</span></el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button v-if="approveStatus === '0'" @click="turnDownDialog">驳回</el-button>
                <el-button v-if="approveStatus === '0'" type="primary" @click="confirmBy">审批通过</el-button>
            </span>
        </el-dialog>

        <el-dialog title="驳回意见" :visible.sync="dialogFormVisible" @close="closeDialogFormVisible('turnDownForm')">
            <el-form :model="turnDownForm" ref="turnDownForm" :rules="turnDownRules">
                <el-form-item label="驳回意见：" label-width="100px" prop='content'>
                    <el-input type="textarea" v-model="turnDownForm.content" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="turnDownOk('turnDownForm')">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="审批流水" :visible.sync="dialogApprovalFlow" width='30%'>
            <el-row v-for='(item,index) in ApprovalFlowData' :key='index'>
                <el-col :span='2'>
                    <span class='flowNum'>{{index+1}}</span>
                </el-col>
                <el-col :span='12'>
                    <div v-for='(elem,num) in item.confPersonMappings' :key='num' style='display:inline-block'>
                        <span v-if='num === 0'>{{item.confPersonMappings[0].comment ? elem.comment : '等待审批'}}：</span>
                        <span v-if='num+1 === item.confPersonMappings.length'>{{elem.userName}}</span>
                        <span v-else>{{elem.userName}}，</span>
                    </div>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>

<script src="./js/approvalList.js"></script>
<style scoped>
.info-head {
  background: rgba(240, 243, 249, 1);
  opacity: 1;
  margin-top: -84px;
  margin-bottom: 4px;
  height: 114px;
}
.info-head img {
  height: 114px;
}
.info-head > .titleInfo {
  font-size: 20px;
  font-family: Segoe UI;
  font-weight: 600;
  line-height: 27px;
  color: rgba(71, 71, 71, 1);
  opacity: 1;
  line-height: 114px;
  margin-left: 30px;
}

    .info-head .reject {
        margin: 12px 0 20px 104px;
        color: red;
        font-size: 12px;
        margin-bottom: 8px;
    }

    .info-head h2 {
        text-align: center;
    }

    .crd-bdy>div.el-row {
        height: 32px;
    }

    .charge_title {
        font-weight: 600;
        height: 30px;
        line-height: 30px;
        font-size: 16px;
    }

    .charge_subtitle {
        height: 28px;
    }

    .charge_li {
        color: #999;
        height: 24px;
    }

    .fl_r {
        float: right;
    }

    .appinfo .el-form-item__label {
        width: 150px;
    }

    .flowNum {
        display: block;
        width: 15px;
        height: 15px;
        line-height: 15px;
        text-align: center;
        border-radius: 50%;
        border: 1px solid #9b9a9a;
        color: #9b9a9a;
        margin-top: 2px;
    }
    .appinfo {
      width: 85%;
      margin: 10px auto;
    }
</style>
<style>
    .approvalDialog .el-dialog {
        width: 70%;
        height: 550px;
        overflow: auto
    }
</style>
