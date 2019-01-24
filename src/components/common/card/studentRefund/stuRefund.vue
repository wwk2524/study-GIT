<template>
    <el-card class="box-card" v-show="showInfo" id='card-con'>
        <div slot="header" class="card-header ps_r" style="padding: 0px;">
            <img src="static/images/logo.png" class='' style="position: absolute;top:7px;left:40px;">
            <p class="text-center">深圳第二高级技工学校就业技能训练中心</p>
        </div>
        <el-form :model="studentInfo" ref="studentInfo" :rules="studentInfoRule" label-width="68px" style="padding:0 20px">
            <el-row>
                <el-col :span="10">
                    <div>
                        <div class="user-header" v-if="studentInfo.regPhoto">
                            <img :src="$api.baseUrl + 'baseInfo/file/downLoadImg?url=' + studentInfo.regPhoto.slice(1)" alt="学生头像" style="width: 100%;height: 100%;">
                        </div>
                        <div v-if="!studentInfo.regPhoto" class="user-header text-center"></div>
                    </div>
                </el-col>
                <el-col :span="14">
                    <div class="info-row">姓名: <span class="font-w">{{studentInfo.studentName}}</span></div>
                    <div class="info-row">性别: <span class="font-w">{{studentInfo.studentSex === '1' ? '男' : '女'}}</span></div>
                    <div class="info-row">班级代码: <span class="font-w">{{studentInfo.classCode}}</span></div>
                    <div class="info-row">工种: <span class="font-w">{{studentInfo.specialtyName}}</span></div>
                    <div class="info-row">学号: <span class="font-w">{{studentInfo.studentCode}}</span></div>
                    <div class="info-row">手机: <span class="font-w">{{studentInfo.studentPhone}}</span></div>
                </el-col>
            </el-row>
            <el-row id="card-from">
                <p class="info-title">退费处理</p>
                <div class="info-row-item">报名发票:
                    <span class="pl10">{{studentInfo.invoiceNum}}</span>
                    <span class="right">
                        <el-checkbox v-if="isEdit" :true-label="'1'" :false-label="'0'" v-model="studentInfo.invoiceIsReturn">退回</el-checkbox>
                        <span v-if="!isEdit">{{parseInt(studentInfo.invoiceIsReturn) === 1 ? '已退回' : '未退回'}}</span>
                    </span>
                </div>
                <el-row class="info-row-item">
                    <el-col :span="4">教材状态:</el-col>
                    <el-col :span="20">
                        <div v-for="(item,idx) in studentInfo.studentTextbooks" :key="idx" class="info-row">{{item.textbookName}}(￥{{item.textbookPrice}})
                            <span class="right">
                                <el-checkbox v-if="isEdit" :true-label="'1'" :false-label="'0'" v-model="item.textbookStatus">退回</el-checkbox>
                                <span v-if="!isEdit">{{parseInt(item.textbookStatus) === 0 ? '已退回' : '未退回'}}</span>
                            </span>
                        </div>
                        <!-- <div v-if="studentInfo.studentTextbooks.length === 0">无</div> -->
                    </el-col>
                </el-row>
                <div class="info-row-item " style="padding-bottom: 10px;">
                    已上课时:
                    <span class="pl10">{{studentInfo.courseNumber}}节 ({{studentTypeLabels[studentInfo.studentType]}})</span>
                </div>
                <div v-if="!isEdit">
                    <div class="info-row-item " style="padding-bottom: 10px;">
                        扣费:
                        <span class="pl10">{{studentInfo.deductions}}</span>
                    </div>
                    <div class="info-row-item " style="padding-bottom: 10px;">
                        备注:
                        <span class="pl10">{{studentInfo.remark}}</span>
                    </div>
                </div>
                <div v-if="isEdit">
                    <el-form-item label="扣费:" prop="deductions">
                        <el-input v-model="studentInfo.deductions" style="width:200px" size="small"></el-input>
                    </el-form-item>

                    <el-form-item label="备注:" prop="remark">
                        <el-input v-model="studentInfo.remark" style="width:200px" size="small"></el-input>
                    </el-form-item>
                </div>

            </el-row>
            <el-row>
                <p class="info-title">退费信息</p>
                <div class="info-row-item">学生已缴费用: <span class="right">{{studentInfo.tuition}}元</span></div>
                <div class="info-row-item">领取教材: {{getBooks().usedBooksName}}<span class="right">{{getBooks().usedBooksCharge}}元</span></div>
                <div class="info-row-item">扣费: <span class="right">{{studentInfo.deductions}}元</span></div>
                <div class="info-row-item"> <span class="right">合计退费: <span class="pl20" style="color:red;font-weight: bold;">{{getTotal()}}元</span> </span></div>
            </el-row>
            <el-row v-if="isEdit" class="text-center mt20">
                <el-button size="small" type="success" style="margin-left: 5px;" @click="ensureAddRefund">确认退费</el-button>
                <el-button size="small" type="success" style="margin-left: 5px;" @click="cancel">取消</el-button>
            </el-row>
        </el-form>
    </el-card>
</template>
<style>
#card-con .el-card__header {
  padding: 0px !important;
}
#card-from .el-form-item__label {
  width: 90px !important;
}
</style>


<style scoped>
.font-w {
  font-weight: bold;
  padding-left: 6px;
}
.user-header {
  padding: 5px;
  width: 100px;
  height: 130px;
  background-color: #e5e5e5;
}
.card-header {
  /* width: 441px; */
  height: 60px;
  background: rgba(0, 146, 243, 1);
  opacity: 1;

  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 60px;
  color: rgba(255, 255, 255, 1);
}
.box-card {
  width: 100%;
}
.info-title {
  font-size: 16px;
  font-weight: 600;
  margin: 10px 0;
}
.info-row-item {
  padding: 5px 0px 2px 20px;
  /* line-height: 26px; */
  /* height: 26px; */
}
.info-row {
  height: 22px;
  padding: 2px 0px 2px 10px;
  /* margin: 4px 0; */
  /* line-height: 22px; */
}
.info-row span {
  /* float: right; */
}
</style>
<script src="./stuRefund.js"></script>
