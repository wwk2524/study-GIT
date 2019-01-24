<template>
    <div class="ins-container pd2 openclass">
        <div class="ins-page-top">
            <!-- page title -->
            <div class="ins-page-title">
                <returnBtn :title="'学生报名信息确认'"></returnBtn>
            </div>
        </div>
        <div class='ins-page-con'>
            <div class='add-student-con'>
                <el-steps :active="step" align-center>
                    <el-step title="基本信息"></el-step>
                    <el-step title="教材/学费信息"></el-step>
                    <el-step title="学籍信息"></el-step>
                    <el-step title="完成"></el-step>
                </el-steps>
                <el-row v-if="step === 1" class='mt30'>
                    <el-form :model="one" ref="one" :rules="oneRules" label-width="145px">
                        <el-form-item label="姓名：" prop="studentName" style='display:inline-block;width: 34%;'>
                            <el-input v-if='!select' type='text' placeholder="请输入姓名" v-model="one.studentName" clearable></el-input>
                            <span v-else>{{one.studentName}}</span>
                        </el-form-item>
                        <el-form-item label="手机：" prop="studentPhone" style='display:inline-block;width: 30%;'>
                            <el-input v-if='!select' type='text' placeholder="请输入手机号" v-model="one.studentPhone" clearable></el-input>
                            <span v-else>{{one.studentPhone}}</span>
                        </el-form-item>
                        <el-form-item label="学历：" prop="studentEducation" style='display:inline-block;width: 26%;'>
                            <el-select v-if='!select' v-model="one.studentEducation" placeholder="请选择学历" clearable>
                                <el-option v-for="item in educationOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                            <span v-else>{{educationOptionsValue[one.studentEducation]}}</span>
                        </el-form-item>
                        <!-- 是否为大陆 -->
                        <el-form-item label='' style='display:inline-block;width: 10%;margin:-27px 128px 0px -52px;' prop='isChinese'>
                            <el-checkbox v-if='!select' v-model="one.isChinese">中国大陆地区</el-checkbox>
                            <label  role="checkbox" class="el-checkbox" v-else>{{one.isChinese ? '中国大陆地区' : '非中国大陆地区'}}</label>
                        </el-form-item>
                        <el-form-item label="身份证号：" prop="studentIdCard" style='display:inline-block;width:26%;'>
                            <el-input v-if='!select' type='text' placeholder="请输入身份证号" v-model="one.studentIdCard" clearable></el-input>
                            <span v-else>{{one.studentIdCard}}</span>
                        </el-form-item>
                        <el-form-item label="性别：" prop="studentSex" style='display:inline-block;width: 24%;'>
                            <el-select v-if='!select && one.isChinese === true' disabled v-model="one.studentSex" placeholder="请选择性别" clearable>
                                <el-option v-for="item in sexOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                            <el-select v-else-if='!select' v-model="one.studentSex" placeholder="请选择性别" clearable>
                                <el-option v-for="item in sexOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                            <span v-else>{{one.studentSex === '1' ? '男':'女'}}</span>
                        </el-form-item>
                        <!-- 出生日期 -->
                        <el-form-item label="出生日期：" style='display:inline-block;width: 26%;' prop='studentBirthday'>
                            <el-date-picker v-if='!select && one.isChinese === true' v-model="one.studentBirthday" disabled style='width:100%;' clearable type="date" placeholder="请选择日期"></el-date-picker>
                            <el-date-picker v-else-if='!select' v-model="one.studentBirthday" style='width:100%;' clearable type="date" placeholder="请选择日期"></el-date-picker>
                            <span v-else>{{one.studentBirthday}}</span>
                        </el-form-item>
                        <hr style="height: 0;margin: 20px 0;border-top: 1px solid #e3e3e3;">
                        <el-form-item label="类别：" style='display:inline-block;width: 22%;vertical-align: middle;'>
                            <el-select v-if='!select' v-model="classTypeValue" filterable placeholder="请选择类别" @change='changeClassType' clearable>
                                <el-option v-for="item in classTypeOptions" :key="item.category" :label="item.categoryName" :value="item.category"></el-option>
                            </el-select>
                            <span v-else>{{signUpClassOwn.classTypeValueName}}</span>
                        </el-form-item>
                        <el-form-item label="工种：" style='display:inline-block;width: 24%;vertical-align: middle;'>
                            <el-select v-if='!select' v-model="workTypeValue" filterable placeholder="请选择工种" @change='changeWk' clearable>
                                <el-option v-for="item in workTypeOptions" :key="item.specialty" :label="item.specialtyName" :value="item.specialty"></el-option>
                            </el-select>
                            <span v-else>{{signUpClassOwn.workTypeValueName}}</span>
                        </el-form-item>
                        <el-form-item label="班级代码：" prop="classId" style='display:inline-block;width: 52%;vertical-align: middle;'>
                            <el-select v-if='!select' v-model="one.classId" placeholder="请选择班级" @change='classDetail(one.classId)' clearable>
                                <el-option v-for="item in classOptions" :key="item.classId" :label="item.classCode" :value="item.classId"></el-option>
                            </el-select>
                            <span v-else>{{signUpClassOwn.className}}</span>
                        </el-form-item>

                        <el-row :gutter="20" v-if="one.classId">
                            <el-col :span="8">
                                <label for="classId" class="el-form-item__label" style="width: 145px;">性质：</label>
                                <div class="el-form-item__content">{{natureList[classDetailData.nature]}} </div>
                            </el-col>
                            <el-col :span="8">
                                <label for="classId" class="el-form-item__label" style="width: 145px;">类别：</label>
                                <div class="el-form-item__content">{{classDetailData.category}} </div>
                            </el-col>
                            <el-col :span="8">
                                <label for="classId" class="el-form-item__label" style="width: 85px;">工种：</label>
                                <div class="el-form-item__content">{{classDetailData.specialty}} </div>
                            </el-col>
                        </el-row>

                        <el-row :gutter="20" v-if="one.classId" class='mt10'>
                            <el-col :span="8">
                                <label for="classId" class="el-form-item__label" style="width: 145px;">上课时间：</label>
                                <div class="el-form-item__content">{{classDetailData.classTime}} </div>
                            </el-col>
                            <el-col :span="8">
                                <label for="classId" class="el-form-item__label" style="width: 145px;">开班日期：</label>
                                <div class="el-form-item__content">{{$api.getDateAll(classDetailData.startDate)}} </div>
                            </el-col>
                            <el-col :span="8">
                                <label for="classId" class="el-form-item__label" style="width: 85px;">开班地点：</label>
                                <div class="el-form-item__content">{{classDetailData.classAddr}} </div>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" style='width:600px;margin:20px 0 0 48px;'>
                            <div class='left'>个人登记照：</div>
                            <div class='left'>
                                <el-form-item class='head-img' label-width="10px">
                                    <el-upload v-if='!select' :headers="{'authorization':token}" :action="baseUrl+'baseInfo/file/uploadFile'" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                                        <img v-if="imageUrl" class='header-img' :style="{'background-image':'url('+imageUrl+')'}">
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                                    <img v-else class='header-img' :style="{'background-image':'url('+imageUrl+')'}">
                                </el-form-item>
                                <!-- <p class='warning-txt pl30'>个人登记照只能为小一寸照片413*295像素</p> -->
                            </div>
                        </el-row>
                    </el-form>
                    <div class='text-center next-btn' style="float: right;margin-top: -40px;margin-right: 100px;">
                        <el-button type="primary" @click="next('one')">下一步</el-button>
                    </div>
                </el-row>
                <el-row :gutter="20" v-if="step === 2" class='mt30'>
                    <el-col :span="24">
                        <label for="classId" class="el-form-item__label" style="width: 145px;">学费：</label>
                        <div class="el-form-item__content">
                            <el-checkbox v-if='!select' v-model="isConfirm">已交</el-checkbox>
                            <span style="font-size: 18px;font-weight: bold;">{{classDetailData.tuition}}</span>元
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <label for="classId" class="el-form-item__label" style="width: 145px;">打印发票：</label>
                        <div class="el-form-item__content">
                            <el-checkbox v-if='!select' v-model="isPrintInvoice">打印发票</el-checkbox>
                            <el-checkbox v-else disabled v-model="isPrintInvoiceValue"> {{isPrintInvoiceValue ? '已打印发票':'未打印发票'}}</el-checkbox>
                        </div>
                    </el-col>

                    <el-col :span="8" style="height:40px">
                        <label for="classId" class="el-form-item__label" style="width: 145px;"></label>
                        <div class="el-form-item__content">
                            <div v-show='isPrintInvoice!==true'></div>
                            <el-form v-show='isPrintInvoice===true || isPrintInvoiceValue' style=" margin-left: 50px;" :model='two'>
                                <el-form-item label='发票号：' prop='printInvoiceValue'>
                                    <el-input v-if='!select' style="width: 200px;" type='text' placeholder="请输入发票" v-model="two.printInvoiceValue" clearable></el-input>
                                    <span v-else>{{invoiceNum !== 'null' ? invoiceNum : ''}}</span>
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-col>
                    <el-col :span="8" class="mb20">
                        <label for="classId" class="el-form-item__label" style="width: 85px;">教材发放：</label>
                        <div class="el-form-item__content">
                            共{{bookNum}}本
                        </div>
                    </el-col>

                    <el-table ref="multipleTable" :data="bookList" tooltip-effect="dark" style="width: 83%;margin: 20px auto" @selection-change="handleSelectionChange">
                        <el-table-column v-if='!select' type="selection" width="55"></el-table-column>
                        <el-table-column prop="textbookName" label="教材名称"></el-table-column>
                    </el-table>
                    <div class='text-center next-btn' style="float: right;margin-top: 180px;margin-right: 145px;">
                        <el-button type="warning" @click='prePage(1)'>上一步</el-button>
                        <el-button type="primary" @click="nextTwo">下一步</el-button>
                    </div>
                </el-row>
                <el-row v-if="step=== 3" class='mt30'>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <label for="classId" class="el-form-item__label" style="width: 145px;">姓名：</label>
                            <div class="el-form-item__content">{{userInfo.studentName}} </div>
                        </el-col>
                        <el-col :span="8">
                            <label for="classId" class="el-form-item__label" style="width: 145px;">性别：</label>
                            <div class="el-form-item__content">{{sexOptionsValue[userInfo.studentSex]}} </div>
                        </el-col>
                        <el-col :span="8">
                            <label for="classId" class="el-form-item__label" style="width: 85px;">学历：</label>
                            <div class="el-form-item__content">{{educationOptionsValue[userInfo.studentEducation]}} </div>
                        </el-col>
                        <el-col :span="8">
                            <label for="classId" class="el-form-item__label" style="width: 145px;">身份证号：</label>
                            <div class="el-form-item__content">{{userInfo.studentIdCard}} </div>
                        </el-col>
                        <el-col :span="8">
                            <label for="classId" class="el-form-item__label" style="width: 145px;">手机：</label>
                            <div class="el-form-item__content">{{userInfo.studentPhone}} </div>
                        </el-col>
                        <el-col :span="8">
                            <label for="classId" class="el-form-item__label" style="width: 145px;">班级代码：</label>
                            <div class="el-form-item__content">电工（初级）36期 </div>
                        </el-col>
                        <el-col :span="8">
                            <label for="classId" class="el-form-item__label" style="width: 145px;">学费：</label>
                            <div class="el-form-item__content">{{classDetailData.tuition}}元 </div>
                        </el-col>
                    </el-row>

                    <el-form label-width="145px" ref='userInfo' v-bind:class="[{ 'mt30': select }]" :model="userInfo" :rules="threeRules">
                        <el-row>
                            <el-form-item label="邮箱：" prop="studentEmail" style='display:inline-block;width: 30%;'>
                                <el-input v-if='!select' type='text' placeholder="请输入邮箱" v-model="userInfo.studentEmail" clearable></el-input>
                                <span v-else>{{userInfo.studentEmail}}</span>
                            </el-form-item>
                            <el-form-item label="籍贯：" prop="stuNative" style='display:inline-block;width: 30%;'>
                                <el-cascader v-if='!select' expand-trigger='hover' clearable placeholder="请选择籍贯" v-model='stuNative' :options='cityTwoValue'></el-cascader>
                                <span v-else-if='select && nativePlaceName'>{{nativePlaceName[0]}}{{nativePlaceName[1]}}</span>
                            </el-form-item>
                            <el-form-item label="失业证号：" prop="unemploymentNuimber" style='display:inline-block;width: 30%;'>
                                <el-input v-if='!select' type='text' placeholder="请输入失业证号" v-model="userInfo.unemploymentNuimber" clearable></el-input>
                                <span v-else>{{userInfo.unemploymentNuimber}}</span>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="职务/岗位：" prop="position" style='display:inline-block;width: 30%;'>
                                <el-input v-if='!select' type='text' placeholder="请输入职务/岗位" v-model="userInfo.position" clearable></el-input>
                                <span v-else>{{userInfo.position}}</span>
                            </el-form-item>
                            <el-form-item label="工作单位：" prop="workUnit" style='display:inline-block;width: 60.3%;'>
                                <el-input v-if='!select' type='text' placeholder="请输入工作单位" v-model="userInfo.workUnit" clearable></el-input>
                                <span v-else>{{userInfo.workUnit}}</span>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="备注：" prop="remark" style='display:inline-block;width:90.6%;'>
                                <el-input v-if='!select' type='text' v-model="userInfo.remark" clearable></el-input>
                                <span v-else>{{userInfo.remark}}</span>
                            </el-form-item>
                        </el-row>
                    </el-form>
                    <div class='text-center next-btn' style="float: right;margin-top: 130px;margin-right: 150px;">
                        <el-button type="warning" @click='prePage(2)'>上一步</el-button>
                        <el-button type="primary" @click="nextfour('userInfo')">完成</el-button>
                    </div>
                </el-row>
                <el-row v-if="step=== 4" class='mt30' style="margin-top: 50px;">
                    <div class='add-student-back pb40'>
                        <h1 class='text-center'>该学生报名成功</h1>
                        <div class='text-center next-btn'>
                            <el-button type="primary" @click="backList">返回预报名学生列表</el-button>
                        </div>
                    </div>
                    <div class='print-studentCard clear' style=''>
                        <div class='left ml60'>
                            <el-button type="primary" size='mini' @click="printPositive">打印正面</el-button>
                            <positive class='mt20 positive-card' :dataList='cardDataList'></positive>
                        </div>
                        <div class='right mr60'>
                            <el-button type="primary" size='mini' @click="printBack">打印反面</el-button>
                            <div class='item back-item mt20 back-card'>
                                <p class='back-item-tips'>说明：</p>
                                <div class='back-item-con' v-html="studentCardBackDetail"></div>
                            </div>
                        </div>
                    </div>
                </el-row>
            </div>
        </div>
    </div>
</template>
<style>
    .head-img .el-form-item__content,
    .head-img .avatar-uploader-icon {
        width: 157px;
        height: 220px;
        line-height: 0;
    }

    .head-img .avatar-uploader-icon {
        line-height: 220px;
    }

    .add-student-con .el-step.is-center .el-step__description {
        margin-top: 10px;
    }

    .add-student-con .el-select {
        width: 100%;
    }

    .add-student-con .el-upload {
        border: 1px solid #e2e3e3;
    }
</style>
<style scoped>
    @media print {
        body {
            -webkit-print-color-adjust: exact;
        }
    }

    .add-student-back {
        border-bottom: 1px solid #ededed;
    }

    .print-studentCard {
        width: 900px;
        margin: 30px auto 0;
        overflow: hidden;
    }

    .head-img img {
        width: 157px;
        height: 220px;
        background-size: 100%;
        background-position: center;
        background-repeat: no-repeat;
    }

    h2 {
        background: #ededed;
        padding: 15px;
    }

    h4 {
        padding: 10px 15px;
        border-bottom: 1px solid #ededed;
        margin-bottom: 30px;
    }

    .add-student-con {
        /* height: 100%; */
        padding: 30px;
        background: #fff;
    }

    .next-btn {
        margin-top: 30px;
    }

    .ins-container {
        height: 100%;
        padding-bottom: 25px;
        display: flex;
        flex-direction: column;
    }

    .back-item {
        width: 332px;
        height: 414px;
        border: 1px solid #d2d2d2;
        padding: 104px 30px 30px;
    }

    .back-item-tips {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
        color: #4D4D4D;
    }

    .back-item-con {
        font-size: 12px;
        color: #4D4D4D;
    }
</style>

<script src='./js/addStudent.js'></script>
