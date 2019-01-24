<template>
  <div class="ins-container">
    <div class="ins-page-top">
      <!-- page title -->
      <div class="ins-page-title">
        开班列表
      </div>
    </div>
    <!-- 页面主体 -->
    <div class="ins-page-con">
      <div class="ins-page-search">
        <div class="ins-opa-btn">
          <el-button type="primary" size='small' icon="el-icon-circle-plus" @click="applyNew">新开班申请</el-button>
        </div>
        <div class="right">
          <div class="ins-search-con" style="margin-right: 10px;">
            <school-area v-model="queryCondition.classAddr" :width="'200px'"></school-area>
            <class-time v-model="queryCondition.classTime"></class-time>
            <class-status v-model="queryCondition.classStatus"></class-status>
            <el-input v-model="queryCondition.arg1" size="medium" placeholder="输入关键字 如：班级代码 工种" style="width:250px"></el-input>
          </div>
          <div class="ins-opa-btn">
            <el-button size="small" type="primary" round @click="getTblData"><span class="el-icon-search ins-s-mr-5"></span>查询</el-button>
            <el-button size="small" type="success" round @click="resetSearch" style="margin-left: 5px;">重置</el-button>
          </div>
        </div>
      </div>
      <div class="ins-page-main">
        <div class="ins-content-con ins-s-hf">
          <div class="ins-table divide">
            <!-- title -->
            <div class="ins-title">
              <span>开班申请表</span>
              <!-- 复制 打印 -->
              <div class="tabbar-con">
                <tableBar type="export" tableId="tab" :scrColumn1.sync="scrColumn"></tableBar>
              </div>
            </div>
            <!-- content -->
            <div class="ins-tab-con">
              <el-table :data="tableData" border id="tab" stripe>
                <!-- <el-table-column align="left" class-name="checkbox" type="selection"  width="55"></el-table-column> -->

                <el-table-column align="left" label="班级代码" prop="classCode" show-overflow-tooltip sortable v-if="scrColumn.classCode.selected">

                  <template slot-scope="scope">
                    <div class="excel-string ins-table-card" @click="showDetail(scope.row)">
                      {{scope.row.classCode}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="left" label="性质" prop="natureName" show-overflow-tooltip sortable v-if="scrColumn.natureName.selected"></el-table-column>
                <el-table-column align="left" label="工种" prop="specialtyName" show-overflow-tooltip sortable v-if="scrColumn.specialtyName.selected"></el-table-column>
                <el-table-column align="left" label="上课时间" prop="classTime" show-overflow-tooltip sortable v-if="scrColumn.classTime.selected"></el-table-column>
                <el-table-column align="left" label="开班日期" prop="startDate" show-overflow-tooltip sortable v-if="scrColumn.startDate.selected">
                  <template slot-scope="scope">
                    <span>{{$api.getDateAll(scope.row.startDate)}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="left" label="开班地点" prop="classAddrName" show-overflow-tooltip sortable v-if="scrColumn.classAddrName.selected"></el-table-column>
                <el-table-column align="left" label="学费标准" prop="tuition" show-overflow-tooltip sortable v-if="scrColumn.tuition.selected"></el-table-column>
                <!-- <el-table-column align="left" label="预计结余" prop="surplusTotal" show-overflow-tooltip sortable v-if="scrColumn.surplusTotal.selected"></el-table-column> -->
                <el-table-column align="left" label="状态" prop="classStatus" show-overflow-tooltip sortable v-if="scrColumn.classStatus.selected">
                  <template slot-scope="scope">
                    <span class="ins-table-card" @click="showDetail(scope.row)">{{classStatusLabels[scope.row.classStatus]}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="left" label="操作" class-name='operating-table-column' show-overflow-tooltip v-if="scrColumn.otherField.selected" width="250px">
                  <template slot-scope="scope">
                    <el-button @click="delTblRow(scope.row)" plain size="mini" type="danger" v-if="scope.row.classStatus !== '0'">删除</el-button>
                    <el-button @click="editTblRow(scope.row)" plain size="mini" type="warning" v-if="scope.row.classStatus !== '0'">编辑</el-button>
                    <el-button v-show="parseInt(scope.row.classStatus) === 1" @click="showIntentStus(scope.row)" plain size="mini" type="success">意向人员</el-button>
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

    <!-- 申请信息 -->
    <el-dialog id="ClassDialog" :visible.sync="dialogVisible" class="minwiddia" width='70%'>
      <span style="position: relative;left: 164px;top: -49px;font-size: 17px;">{{curClassInfo.classCode + curClassInfo.specialtyName }}</span>
      <button type="button" class="el-dialog__headerbtn" style="top: -17px;font-size: 30px;" @click="coloseDialog">
        <i class="el-dialog__close el-icon el-icon-close"></i>
      </button>
      <!-- （0 通过审批 1 审批中 2 驳回） -->
      <div class="info-head clear" v-if="curClassInfo.classStatus === '0'">
        <div class='left'>
          <img :src="'static/images/approved0.png'" alt="">
        </div>
        <div class="titleInfo left">
          通过开班审批！您可以去申请开课了！
                <router-link to="/startClass/list" style="color: #fff;"><el-button type="primary" size="mini">去申请开课</el-button></router-link>
        </div>
      </div>

      <div class="info-head clear" v-if="curClassInfo.classStatus === '1'">
        <div class='left'>
          <img :src="'static/images/approved1.png'" alt="">
        </div>
      </div>

      <div class="info-head clear" v-if="curClassInfo.classStatus === '2'">
        <div class='left'>
          <img :src="'static/images/approved2.png'" alt="">
        </div>
        <div class="titleInfo left">
          <div v-if="!!curClassInfo.dismissal" class="reject"><span style="color:#FF0D0D;">驳回理由：</span>{{curClassInfo.dismissal}}</div>
        </div>
      </div>
      <!-- 班级状态（0 通过审批 1 审批中 2 驳回） -->
      <apply-info :value="curClassInfo"></apply-info>
      <el-row v-if="parseInt(curClassInfo.classStatus)  === 0" class='appinfo mt30'>
        <el-col :span='7'><span class="el-form-item__label">申请时间：</span><span class="el-form-item__content">{{$api.getDateAll(curClassInfo.createDate,'-','hms')}}</span></el-col>
        <el-col :span='7'><span class="el-form-item__label">通过时间：</span><span class="el-form-item__content">{{$api.getDateAll(curClassInfo.confirmDate,'-','hms')}}</span></el-col>
        <el-col :span='7'><span class="el-form-item__label">通过人：</span><span class="el-form-item__content">{{curClassInfo.confirmPerson}}</span></el-col>
      </el-row>
      <el-row v-if="parseInt(curClassInfo.classStatus) === 2" class='appinfo mt30'>
        <el-col :span='7'><span class="el-form-item__label">申请时间：</span><span class="el-form-item__content">{{$api.getDateAll(curClassInfo.createDate,'-','hms')}}</span></el-col>
        <el-col :span='7'><span class="el-form-item__label">驳回时间：</span><span class="el-form-item__content">{{$api.getDateAll(curClassInfo.confirmDate,'-','hms')}}</span></el-col>
        <el-col :span='7'><span class="el-form-item__label">驳回人：</span><span class="el-form-item__content">{{curClassInfo.confirmPerson}}</span></el-col>
      </el-row>
    </el-dialog>

    <!-- 意向人员 -->
    <el-dialog :title="stu.classCode + '意向人员'" :visible.sync="stuListVisible" class="minwiddia">
      <!--<h3 style="padding-bottom:12px">{{stu.classCode}}意向人员</h3>-->
      <el-table :data="stuList" border height="100%" id="tab" stripe style="height:100%;width:100%;">
        <el-table-column align="left" width="100" label="序号" type="index"></el-table-column>
        <el-table-column align="left" label="学生姓名" prop="studentName"></el-table-column>
        <el-table-column align="left" label="手机号" prop="phone"></el-table-column>
        <el-table-column align="left" label="提交意向时间" prop="date">
          <template slot-scope="scope">
            {{$api.getDateAll(scope.row.date)}}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="margin:30px auto 0;text-align: center;" :current-page="stu.currentPage" :page-size="stu.size" :page-sizes="stu.sizeArr" :total="stu.total" @current-change="stuPageChange" @size-change="stuPageSizeChange" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    </el-dialog>

  </div>
</template>

<script src="./js/classes.js"></script>
<style scoped>
.crd-bdy > div.el-row {
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

.minwiddia >>> .el-dialog__body {
  position: relative;
  padding-bottom: 66px;
}
.minwiddia >>> .el-form-item__label {
  width: auto;
  text-align: left;
}
.minwiddia >>> .info_content {
  display: block;
}

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

.appinfo {
  width: 85%;
  margin: 10px auto;
}
</style>
<style>
.minwiddia .el-dialog {
  min-width: 950px;
}
</style>



