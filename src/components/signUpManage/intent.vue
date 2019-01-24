<template>
  <div class="ins-container">
    <div class="ins-page-top">
      <!-- page title -->
      <div class="ins-page-title">
        学员意向列表
      </div>
    </div>
    <!-- 页面主体 -->
    <div class="ins-page-con">
      <div class="ins-page-search">
        <!-- <div class="ins-opa-btn">
          <el-button size="small" type="primary" @click="delTblRow">删除</el-button>
        </div> -->
        <div class="ins-opa-btn right">
          <school-area v-model="query.classAddr" style="width:200px"></school-area>
          <el-input v-model="query.arg1" size="medium" placeholder="输入关键字，例如：类别，工种" style="width:250px;margin-right: 10px;"></el-input>
          <el-button size="small" type="primary" round @click="getTblData"><span class="el-icon-search ins-s-mr-5"></span>查询</el-button>
          <el-button size="small" type="success" round style="margin-left: 5px;" @click="resetSearch">重置</el-button>
        </div>
        <div class="ins-search-con right" style="margin-right: 10px;">
        </div>
      </div>
      <div class="ins-page-main">
        <div class="ins-content-con ins-s-hf">
          <div class="ins-table divide">
            <!-- title -->
            <div class="ins-title">
              <!--<span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>-->
              <span>学员意向列表</span>
              <!-- 复制 打印 -->
              <div class="tabbar-con">
                <tableBar type="export" tableId="tab"></tableBar>
              </div>
            </div>
            <!-- content -->
            <div class="ins-tab-con">
              <el-table :data="tableData" border height="100%" id="tab" class='FE-pagination' stripe style="width:100%;height: auto;">
                <el-table-column align="left" label="类别" prop="categoryName" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{scope.row.specialtyCode}} {{scope.row.categoryName}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="left" label="工种" prop="specialtyName" show-overflow-tooltip sortable>
                  <template slot-scope="scope">
                    <span class="ins-table-card" @click="showSpecialty(scope.row.specialty)">{{scope.row.specialtyCode}} {{scope.row.specialtyName}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="left" label="开班地点" prop="classAddrName" show-overflow-tooltip sortable></el-table-column>
                <el-table-column align="left" label="学费标准" prop="tuition" show-overflow-tooltip sortable></el-table-column>
                <el-table-column align="left" label="当前意向人数" prop="signUpNum" show-overflow-tooltip sortable>
                  <template slot-scope="scope">
                    <span class="ins-table-card" @click="showStuList(scope.row.specialty)">{{scope.row.signUpNum}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="left" label="操作" class-name='operating-table-column' prop="otherField" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-button @click="applyNew(scope.row.specialty)" plain size="mini" type="success">新开班</el-button>
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

    <!--工种详情 -->
    <el-dialog title='工种信息' class='minwiddia' :visible.sync="specialtyVisible" width="50%" @close='handleClose'>
      <div class="appinfo">
        <h3>默认信息</h3>
        <el-row>
          <el-col :span="8"><span class="el-form-item__label">学费标准:</span><span class="el-form-item__content">{{specialtyDetail.tuition}}</span></el-col>
          <el-col :span="8"><span class="el-form-item__label">报名地点:</span><span class="el-form-item__content">{{specialtyDetail.registrationSiteName}}</span></el-col>
          <el-col :span="8"><span class="el-form-item__label">联系老师:</span><span class="el-form-item__content">{{specialtyDetail.contactTeacher}}</span></el-col>
        </el-row>
        <el-row>
          <el-col :span="8"><span class="el-form-item__label">成本人数:</span><span class="el-form-item__content">{{specialtyDetail.costNumber}}</span></el-col>
          <el-col :span="8"><span class="el-form-item__label">上课地点:</span><span class="el-form-item__content">{{specialtyDetail.classAddrName}}</span></el-col>
          <el-col :span="8"><span class="el-form-item__label">联系电话:</span><span class="el-form-item__content">{{specialtyDetail.contactNumber}}</span></el-col>
        </el-row>
        <el-row>
          <el-col :span="8"><span class="el-form-item__label">限额人数:</span><span class="el-form-item__content">{{specialtyDetail.quotaNumber}}</span></el-col>
          <el-col :span="8"><span class="el-form-item__label">上课时间:</span><span class="el-form-item__content">{{specialtyDetail.classTime}}</span></el-col>
          <el-col :span="8">
            <span class="el-form-item__label">教材信息:</span>
            <div class="info_content" style="width:50%;margin-left: 72px;margin-top: 10px;">
              <p v-for="(item,idx) in specialtyDetail.bookList" :key="idx">{{item}}</p>
            </div>
          </el-col>
        </el-row>
        <h3>理论课酬标准</h3>
        <el-row>
          <el-col :span="8"><span class="el-form-item__label">主讲老师:</span><span class="el-form-item__content">{{specialtyDetail.teacherWages1}}元/课时</span></el-col>
          <el-col :span="8"><span class="el-form-item__label">辅导老师:</span><span class="el-form-item__content">{{specialtyDetail.teacherWages2}}元/课时</span></el-col>
        </el-row>
        <h3>实操课酬标准</h3>
        <el-row>
          <el-col :span="8"><span class="el-form-item__label">主讲老师:</span><span class="el-form-item__content">{{specialtyDetail.teacherWages3}}元/课时</span></el-col>
          <el-col :span="8"><span class="el-form-item__label">辅导老师:</span><span class="el-form-item__content">{{specialtyDetail.teacherWages4}}元/课时</span></el-col>
        </el-row>
        <h3>工种简介</h3>
        <el-row>
          <el-col :span="14">
            <span class="el-form-item__label">工种简介:</span>
            <div class="info_content" style="width:40%;margin-left: 80px;margin-top: 10px;">{{specialtyDetail.specialtyDesc}}</div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>

    <!--意向人员列表 -->
    <el-dialog title="意向人员" :visible.sync="stu.stuListVisible" class="minwiddia">
      <el-table :data="stu.stuList" border height="100%" id="tab" stripe style="height:100%;width:100%;">
        <el-table-column align="left" label="序号" type="index" width="150"></el-table-column>
        <el-table-column align="left" label="学生姓名" prop="studentName"></el-table-column>
        <el-table-column align="left" label="手机号" prop="phone"></el-table-column>
        <el-table-column align="left" label="身份证号" prop="studentIdCard"></el-table-column>
        <el-table-column align="left" label="提交意向时间" prop="date">
          <template slot-scope="scope">
            {{$api.getDateAll(scope.row.date)}}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="margin-top:12px" :current-page="stu.currentPage" :page-size="stu.size" :page-sizes="stu.sizeArr" :total="stu.total" @current-change="stuPageChange" @size-change="stuPageSizeChange" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    </el-dialog>
  </div>
</template>

<script src="./js/intent.js"></script>
<style scoped>
.minwiddia {
  overflow: auto;
  height: 630px;
}
</style>


