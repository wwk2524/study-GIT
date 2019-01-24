<template>
    <el-form :model="chargesInfo" ref="chargesInfo" :rules="chargesInfoRules" >

        <el-row>

            <el-col :span="24" class="l_col" >
                <el-card class="box-card mb30" :body-style="{ padding: '0px' }">
                    <div class="card-boxy">
                         <p style="padding: 42px 0;text-align: left;font-size:24px">
                            班级结余:￥{{chargesInfo.tuition  * chargesInfo.studentNum - (addUpEvery(chargesInfo.signupCourseCharges) + $api.addUp(chargesInfo.signupTextbookCharges,'textbookPrice') * chargesInfo.studentNum + $api.addUp(chargesInfo.signupOtherCharges,'chargesPrice') + chargesInfo.totalSubsidy + chargesInfo.totalDeductions)+(chargesInfo.studentRefundNum * chargesInfo.tuition -chargesInfo.totalDeductions) }}元 =
                            收入总额（缴费人数学费总额）￥{{chargesInfo.tuition  * chargesInfo.studentNum+(chargesInfo.studentRefundNum * chargesInfo.tuition -chargesInfo.totalDeductions)}}元 -
                            班级支出（课酬费用+教材费用+其他费用）￥{{addUpEvery(chargesInfo.signupCourseCharges) + $api.addUp(chargesInfo.signupTextbookCharges,'textbookPrice') * chargesInfo.studentNum + $api.addUp(chargesInfo.signupOtherCharges,'chargesPrice') + chargesInfo.totalSubsidy + chargesInfo.totalDeductions }}元
                        </p>
                    </div>
                    <div class="card-footer">
                        <el-row>
                            <el-col :span="6">
                                <label class="el-form-item__label" >学费：</label>
                                <div class="el-form-item__content blue-c ft-w">{{chargesInfo.tuition }}元</div>
                            </el-col>

                            <el-col :span="6">
                                <label class="el-form-item__label" >缴费人数：</label>
                                <div  class="el-form-item__content blue-c ft-w font-22">{{chargesInfo.studentNum}}人</div>
                            </el-col>
                            <el-col :span="6">
                                <label class="el-form-item__label" >学费总额：</label>
                                <div  class="el-form-item__content blue-c ft-w font-22">{{chargesInfo.tuition * chargesInfo.studentNum}}元</div>
                            </el-col>
                        </el-row>
                    </div>
                </el-card>
            </el-col>
        </el-row>


        <el-row>
            <el-col :span="12" class="l_col">
                <el-card class="box-card">
                    <div slot="header" class="clearfix " >
                        <span class="ft-w">课程安排和课酬费用（理论课酬+实操课酬+辅导课酬）</span>
                        <span style="float: right; padding: 3px 0">共计：<span class="totlem">{{addUpEvery(chargesInfo.signupCourseCharges)}}元</span></span>
                    </div>
                    <div  class="text item">
                        <el-row class="mulit-item-row border-s"  >
                            <label class="el-form-item__label " >
                                <span class="display_ib w50 text-left"> 理论：</span>
                                总<span class="ft-w p10"> {{addUpLessonType(chargesInfo.signupCourseCharges, 2)}}</span>节
                                </label>
                            <div class="el-form-item__content fl_r">
                                理论课酬：
                                <span class="ft-w p10 ">{{addUpLessonPrice(chargesInfo.signupCourseCharges, 2)}}元</span>
                            </div>
                        </el-row>
                        <el-row class="mulit-item-row border-s" >
                            <label class="el-form-item__label" >
                                <span class="display_ib w50 text-left">实操：</span>
                                总<span class="ft-w p10"> {{addUpLessonType(chargesInfo.signupCourseCharges, 1)}}</span>节

                            </label>
                            <div class="el-form-item__content fl_r">
                                实操课酬：
                                <span class="ft-w p10">{{addUpLessonPrice(chargesInfo.signupCourseCharges, 1)}}元</span>
                            </div>
                        </el-row>
                        <el-row class="mulit-item-row border-s" >
                            <label class="el-form-item__label" >
                                <span class="display_ib w50 text-left">辅导：</span>
                                总<span class="ft-w p10"> {{addUpLessonType(chargesInfo.signupCourseCharges, 0)}}</span>节
                            </label>
                            <div class="el-form-item__content fl_r">
                                辅导课酬：
                                <span class="ft-w p10">{{addUpLessonPrice(chargesInfo.signupCourseCharges, 0)}}元</span>
                            </div>
                        </el-row>

                            <el-row  class="mulit-item-row" style="border-bottom: 1px solid #ddd;">
                                <div class="charge_title">理论</div>
                            </el-row>
                            <el-row style="display:flex; align-items: center;" class="mulit-item-row" v-for="(tItem,tIdx) in chargesInfo.signupCourseCharges" :key="tIdx" v-if="tItem.courseType === '2'">
                                <div style="flex: 1;" >{{tItem.teacherType === '1' ? '主讲老师' : '辅导老师'}}：</div>
                                <div style="flex: 1;">{{tItem.teacherName}} </div>
                                <div style="flex: 1;">
                                    <span>{{tItem.chargesPrice}}</span>
                                     元/节
                                </div>
                                <div style="flex: 1;">课时：<span class="ft-w">{{tItem.classPeriod}} </span>节 </div>
                                <div style="flex: 1;">课酬预算：<span class="ft-w"> ￥{{tItem.chargesPrice * tItem.classPeriod }}</span> </div>
                            </el-row>
                            <el-row  class="mulit-item-row" style="border-bottom: 1px solid #ddd;">
                                <div class="charge_title">实操</div>
                            </el-row>
                            <el-row  style="display:flex; align-items: center;" class="mulit-item-row" v-for="(tItem,tIdx) in chargesInfo.signupCourseCharges" :key="tIdx" v-if="tItem.courseType === '1'">
                                <div style="flex: 1;" >{{tItem.teacherType === '1' ? '主讲老师' : '辅导老师'}}：</div>
                                <div style="flex: 1;">{{tItem.teacherName}} </div>
                                <div style="flex: 1;">
                                    <span>{{tItem.chargesPrice}}</span>
                                     元/节
                                </div>
                                <div style="flex: 1;">课时：<span class="ft-w">{{tItem.classPeriod}} </span>节 </div>
                                <div style="flex: 1;">课酬预算：<span class="ft-w"> ￥{{tItem.chargesPrice * tItem.classPeriod }}</span> </div>
                        </el-row>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="12" class="l_col">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span class="ft-w">教材费用</span>
                        <span style="float: right; padding: 3px 0">共计：
                            <span class="totlem">{{$api.addUp(chargesInfo.signupTextbookCharges,'textbookPrice') * chargesInfo.studentNum}}元</span>
                        </span>
                    </div>
                    <div class="text item">
                        <el-row class="mulit-item-row border-s">
                             <div class="el-form-item__content  mulit-item-row" v-for="(cItem,idx) in chargesInfo.signupTextbookCharges" :key="'theory' + idx" >
                                <div class="el-form-item__label">教材{{idx+1}}:{{cItem.textbookName}}*{{chargesInfo.studentNum}}人</div>
                                <div class="el-form-item__content fl_r">￥{{cItem.textbookPrice}}/元</div>
                            </div>
                        </el-row>
                    </div>
                </el-card>


                <el-card class="box-card mt20">
                    <div slot="header" class="clearfix">
                        <span class="ft-w">其他费用</span>
                        <span style="float: right; padding: 3px 0">共计：
                            <span class="totlem">{{$api.addUp(chargesInfo.signupOtherCharges,'chargesPrice')}}元</span>
                        </span>
                    </div>
                    <div class="text item">
                        <div class="mulit-item-row ">
                             <div class="el-form-item__content  mulit-item-row">
                                <el-row class="mulit-item-row" v-if="chargesInfo.studentRefundNum"><label class="el-form-item__label" >已退费学生{{chargesInfo.studentRefundNum}}名:{{chargesInfo.totalDeductions}} 元 </label></el-row>
                                <el-row class="mulit-item-row"><label class="el-form-item__label" >教师补助金额:{{chargesInfo.totalSubsidy || 0}} 元 </label></el-row>

                                <icon-btn-group   :len="chargesInfo.signupOtherCharges.length" @plus="plusElseListItem"></icon-btn-group>
                                <el-row   v-for="(cItem,idx) in chargesInfo.signupOtherCharges" :key="'c'+idx" class="mulit-item-row">
                                    <el-form-item label=" " style='display:inline-block' label-width="20px" :prop="'signupOtherCharges.' + idx + '.chargesName'" :rules="[{required:true,message:'必填', trigger:'blur'},{ max:20, message:'长度不超过20', trigger: 'blur'}]">
                                      <el-input v-model="cItem.chargesName" style="width:160px"></el-input>
                                    </el-form-item>&nbsp;&nbsp;&nbsp;&nbsp;：
                                    <el-form-item label=" " style='display:inline-block;width:320px;' label-width="8px" :prop="'signupOtherCharges.' + idx + '.chargesPrice'" :rules="[{required:true,message:'必填', trigger:'blur'},{ pattern:/[\-0-9]+$/, message:'输入不合法', trigger: 'blur'}]" >
                                      <el-input v-model="cItem.chargesPrice" style="width:100px"></el-input>&nbsp;元
                                    </el-form-item>
                                    <icon-btn-group style='display:inline-block' :idx="idx" :len="chargesInfo.signupOtherCharges.length" :param="'signupOtherCharges'" @remove="removeListItem" @plus="plusElseListItem"></icon-btn-group>
                                </el-row>
                            </div>
                        </div>
                    </div>
                </el-card>

            </el-col>
        </el-row>
        <el-row style="text-align:center;"  class="mt30 mb50">
            <el-button type="primary"   @click="submit">保存</el-button>
        </el-row>
    </el-form>

</template>
<style scoped>
.w50{width: 50px;font-weight: bold;}
.font-22{font-size: 22px}
.ft-w{font-weight: bold;}
.p10{padding: 0 10px;}
.border-s{   border-bottom: 1px dashed #ddd;}
.mulit-item-row    {    padding: 5px;}
.totlem{
font-size:20px;
font-family:Microsoft YaHei;
font-weight:bold;
color:rgba(255,9,67,1);
 }
 .el-card__header{background: red;}
 .card-boxy{
     padding: 10px 20px;
 }
 .blue-c{color:#007EF3}
 .card-footer{
     height: 60px;
    padding: 10px 20px;
    box-sizing: border-box;
    border-top: 1px solid #ddd;

 }
/* tabs2 */
.showinfo-row .el-form-item__label{
  width: 200px;
}
.showinfo-row .el-form-item__label>span{
  color:#f56c6c;
}
.fl_r{
  float: right;
}
.charge_title{
    font-weight: 600;
    height: 30px;
    line-height: 30px;
    font-size: 16px;
}
.l_col{
  padding-right:20px;
}
.r_col{
  padding-left: 20px;
}
</style>

<script src="./financeDetial.js"></script>
