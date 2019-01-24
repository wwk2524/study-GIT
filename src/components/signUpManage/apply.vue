<template>
  <div class="ins-container openclass">
    <div class="ins-page-top">
      <!-- page title -->
      <returnBtn :title="id ? '编辑开班申请': '新建开班申请'"></returnBtn>
    </div>
    <!-- 页面主体 -->
    <div class="ins-page-con">
      <div class="ins-page-main">
         <el-steps :active="step" align-center finish-status="finish">
            <el-step title="基本信息"></el-step>
            <el-step title="详细信息"></el-step>
            <el-step title="完成"></el-step>
          </el-steps>
          <!-- stpe1 -->
          <el-form style="margin-left: -100px;" v-show="step === 1"  :model="formData"  ref="ruleForm1" :rules="rules1" label-width="200px" :disabled="!!id">
            <el-row>
               <el-col :span="8">
                <el-form-item label="开班年度：" prop="year">
                   <start-year v-model="formData.year" ></start-year>
                </el-form-item>
              </el-col>
               <el-col :span="8">
                  <el-form-item label="类别：" prop="category" >
                    <el-select v-model="formData.category" placeholder="" @change="categoryChange">
                        <el-option v-for="item in paraTree.category" :key="item.id" :label="item.paraValue" :value="item.id" v-if="item.inactive == '1'"></el-option>
                      </el-select>
                  </el-form-item>
               </el-col>
              <el-col :span="8">
                  <el-form-item label="工种：" prop="specialty" >
                    <el-select v-model="formData.specialty" placeholder="请先选择工种" @change="specialtyChange">
                        <el-option v-for="item in specialtyList" :key="item.id" :label="item.paraValue" :value="item.id"  v-if="item.inactive == '1'"></el-option>
                      </el-select>
                  </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
               <el-form-item label="性质：" prop="nature" >
                   <el-select v-model="formData.nature" placeholder="" @change="natureChange">
                      <el-option v-for="item in natureNameList" :key="item.id" :label="item.paraValue" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                  <el-form-item :required="formData.nature === 2"  v-show="formData.nature === 2" label="联办单位：" prop="jointUnit" >
                    <el-input v-model="formData.jointUnit" style="width:200px"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
              <el-col :span="8">
                <el-form-item label="开班日期：" prop="startDate" >
                  <el-date-picker v-model="formData.startDate" type="date" format="yyyy 年 MM 月 dd 日" value-format="timestamp" placeholder="选择日期" style="width:200px"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="结业日期：" prop="endDate" >
                  <el-date-picker v-model="formData.endDate" type="date" format="yyyy 年 MM 月 dd 日" value-format="timestamp" placeholder="选择日期" style="width:200px"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item  label="截止报名日期：" prop="closingUpDate" >
                  <el-date-picker v-model="formData.closingUpDate" type="date" format="yyyy 年 MM 月 dd 日" value-format="timestamp" placeholder="选择日期" style="width:200px"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-row v-show="step === 1" class="text-right pr140">
              <el-button type="primary" @click="nextStep(2)">下一步</el-button>
          </el-row>

          <!-- stpe2 -->
           <el-form v-show="step === 2"  :model="formData" ref="ruleForm2" :rules="rules2" label-width="200px">
             <el-row>
               <el-col :span="8">
                <label class="el-form-item__label" style="width: 200px;">班级代码：</label>
                <div class="el-form-item__content">{{formData.classCode }}</div>
              </el-col>
              <el-col :span="8">
                <label class="el-form-item__label" style="width: 200px;">性质：</label>
                <div  class="el-form-item__content">{{showInfoData.natureName}}</div>
              </el-col>
              <el-col :span="8" v-show="!!formData.jointUnit">
                <label class="el-form-item__label" style="width: 200px;">联办单位：</label>
                <div  class="el-form-item__content">{{formData.jointUnit}}</div>
              </el-col>
             </el-row>
             <el-row>
               <el-col :span="8">
                <label class="el-form-item__label" style="width: 200px;">类别：</label>
                <div class="el-form-item__content">{{showInfoData.categoryName}}</div>
              </el-col>
              <el-col :span="8">
                <label class="el-form-item__label" style="width: 200px;">工种：</label>
                <div  class="el-form-item__content">{{showInfoData.specialtyName}}</div>
              </el-col>
             </el-row>
             <hr style="height: 0;margin: 20px 0;border-top: 1px solid #e3e3e3;">
             <el-row>
               <el-col :span="8">
                <el-form-item label="学费标准：" prop="tuition" >
                    <el-input v-model="formData.tuition" style="width:200px"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="报名地点：" prop="upArea" >
                  <school-area v-model="formData.upArea" :multiple="true" style="width:200px" @getLabel="upAreaChange"></school-area>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="联系老师：" prop="classTeacher" >
                  <el-input v-model="formData.classTeacher" style="width:200px"></el-input>
                </el-form-item>
              </el-col>
             </el-row>
             <el-row>
               <el-col :span="8">
                <el-form-item label="成本人数：" prop="costNumber" >
                    <el-input v-model="formData.costNumber" style="width:200px"></el-input>
                </el-form-item>
               </el-col>
               <el-col :span="8">
                <el-form-item label="上课地点：" prop="classAddr" >
                  <school-area v-model="formData.classAddr"  @getLabel="classAddrChange" style="width:200px"></school-area>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="联系电话：" prop="contactNumber" >
                    <el-input v-model="formData.contactNumber" style="width:200px"></el-input>
                </el-form-item>
               </el-col>
             </el-row>
             <el-row>
               <el-col :span="8">
                <el-form-item label="限额人数：" prop="quotaNumber" >
                    <el-input v-model="formData.quotaNumber" style="width:200px"></el-input>
                </el-form-item>
              </el-col>
               <el-col :span="8">
                <el-form-item label="最低排课人数：" prop="minimumNumber" >
                    <el-input v-model="formData.minimumNumber" style="width:200px"></el-input>
                </el-form-item>
              </el-col>
               <el-col :span="8">
                <el-form-item label="上课时间：" prop="classTime" >
                    <class-time v-model="formData.classTime" style="width:200px;"></class-time>
                </el-form-item>
              </el-col>
             </el-row>
             <el-row>

               <el-col :span="8">
                 <span class="el-form-item__label" style="width:200px">教材信息:</span>
                 <div class="info_content" style="width:50%; margin-bottom: 10px;height: 101px;overflow-y: auto;">
                   <icon-btn-group :len="formData.classTextbookList.length" @plus="bookDialogVisable = true"></icon-btn-group>
                   <p v-for="(item,idx) in formData.classTextbookList" :key="idx">{{item.textbookName}}<icon-btn-group  :len="formData.classTextbookList.length" :idx="idx" @remove="removeBook(item)" @plus="bookDialogVisable = true"></icon-btn-group></p>
                 </div>
               </el-col>
             </el-row>

              <el-row>
                 <el-col :span="16">
                  <el-form-item label="工种简介：" prop="classDesc" >
                    <el-input v-model="formData.classDesc" style="width: 88%;min-width: 200px;min-height: 50px;" type="textarea"></el-input>
                  </el-form-item>
                </el-col>

             </el-row>

             <el-row   class="text-right pr140">
                <el-button type="info" @click="lastStep(1)">上一步</el-button>
                <el-button type="primary" @click="nextStep(3)">提交审批</el-button>
              </el-row>
          </el-form>

          <!-- stpe3 -->
          <el-row v-show="step === 3" >
            <apply-info :value="showInfoData2" style="margin-left: 50px;"></apply-info>
            <h3 style="text-align: center;margin: 20px 0px;">
              <div style="margin-bottom: 10px;">{{id ? '重新提交审批成功!' : '提交开班申请成功!'}}</div>
              <router-link :to="'/signUp/classes'" ><el-button type="primary">返回开班列表</el-button></router-link>
            </h3>
          </el-row>
          <book-list :dialogVisible="bookDialogVisable" @cancel="bookDialogVisable = false" @ensure="getBooks"></book-list>
      </div>
    </div>
  </div>
</template>
<script src="./js/apply.js"></script>
<style>
.pr140{    padding-right: 140px;}
.mulit-item-row .el-form-item {
  float: left;
}
.mulit-item-row .el-select {
  width: 80px;
}
.icon-btn-group {
  float: right;
}
.upload-demo .el-upload-list.el-upload-list--text {
  margin-left: 200px;
}
</style>


<style scoped>
.ins-container {
  height: 100%;
  padding-bottom: 25px;
  display: flex;
  flex-direction: column;
}
.ins-page-main {
  height: auto !important;
  padding: 40px 60px 0;
  padding-bottom: 20px;
}
.showinfo-row .el-form-item__label {
  width: 200px;
}
.showinfo-row .el-form-item__label > span {
  color: #f56c6c;
}
.fl_r {
  float: right;
}
.charge_title {
  font-weight: 600;
  height: 30px;
  line-height: 30px;
  font-size: 16px;
}
.l_col {
  padding-right: 20px;
}
.r_col {
  padding-left: 20px;
}
.info_content {
  width: 50%;
  margin-left: 80px;
  margin-top: 10px;
  text-align: left;
  color: #606266;
}
.info_content p {
  margin-top: 0px;
  margin-bottom: 6px;
}
</style>


