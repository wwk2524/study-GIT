<template>
<div>
    <el-row v-if="isEdit">
        <el-button size="small" type="primary" @click="goBack">返回</el-button>
        <el-button size="small" type="primary" @click="submitSigin">保存</el-button>
        <h3>班级代码：{{baseInfo.classCode}}工种：{{baseInfo.specialtyName}} 班级人数：{{baseInfo.studentNum}} 开班日期：{{$api.getDateAll(baseInfo.classStartDate)}} 结业日期：{{$api.getDateAll(baseInfo.classEndDate)}}</h3>
    </el-row>
    <el-row>
        <el-col :span="6" v-if="isEdit">
             <h3>任课教师历次课酬结算情况</h3>
                <h3>统计日期：{{$api.getDateAll(baseInfo.generaltableStartTime)}}-{{$api.getDateAll(baseInfo.generaltableEndTime)}}</h3>
                <el-form :model="formData" ref="formData" label-width="100px" style="width:100%">
                    <div v-for="(item, index) in formData.classPayList" :key="item.key" class="tf-infowarp">
                        <div class="t-title">{{item.teacherName}}<span class="m-left"></span> <span class="m-right">{{getTeacherCharge(item)}}元</span></div>
                        <div >本次结算费用<span class="m-right">{{getTeacherCharge(item)}}元</span></div>
                        
                        <div v-for="(course, cIdx) in item.courseCharges" :key="'c' + cIdx">
                            <span class="m-left">{{course.courseType === '1' ? '理论' : '实操'}}课酬（标准：{{course.chargesPrice}}元/节）</span> <span class="m-right">{{course.chargesPrice}}x{{course.classPeriod}}={{course.chargesPrice*course.classPeriod}}元</span>
                        </div>
                        
                        <div v-if="item.courseCharges.length === 0" >
                            <div><span class="m-left">理论课酬</span> <span class="m-right">0节</span></div>
                            <div><span class="m-left">实操课酬</span> <span class="m-right">0节</span></div>
                        </div>

                        <el-form-item label="补助金额:" :prop="'classPayList.'+ index + '.subsidy'"  :rules="[{ pattern: /^[0-9]+$/, message: '输入不合法', trigger: 'blur' }]" size="small">
                            <el-input v-model="item.subsidy" style="width:160px"></el-input>
                        </el-form-item>
                        <el-form-item label="备注:" :prop="'classPayList.'+ index + '.remark'" size="small"> 
                            <el-input v-model="item.remark" style="width:160px"></el-input>
                        </el-form-item>
                    </div>
                </el-form>
        </el-col>
        <el-col :span="6" v-if="!isEdit">
             <h3>任课教师历次课酬结算情况</h3>
             <div v-for="(sitem, index) in showPayList" :key="'s' + index">
                <h3>统计日期：{{$api.getDateAll(sitem.generaltableStartTime)}}-{{$api.getDateAll(sitem.generaltableEndTime)}}</h3>
                <div v-for="(ritem, index) in sitem.rewards" :key="'r'+ index" class="tf-infowarp">
                    <div class="t-title">{{ritem.teacherName}}<span class="m-left"></span> <span class="m-right">{{getTeacherCharge(ritem)}}元</span></div>
                    <div >本次结算费用<span class="m-right">{{getTeacherCharge(ritem)}}元</span></div>
                    <div v-for="(course, cIdx) in ritem.courseCharges" :key="'c' + cIdx">
                        <span class="m-left">{{course.courseType === '1' ? '理论' : '实操'}}课酬（标准：{{course.chargesPrice}}元/节）</span> <span class="m-right">{{course.chargesPrice}}x{{course.classPeriod}}={{course.chargesPrice*course.classPeriod}}元</span>
                    </div>
                    <div>补助金额:<span class="m-right">{{ritem.subsidy || 0}}元</span></div>
                    <div>备注:<span  class="m-right">{{ritem.remark || 0}}元</span></div>
                </div>
             </div>
        </el-col>
        <el-col :span="18">
            <el-table 
            :data="tableData" 
            border height="100%" id="tab" 
            class='FE-pagination' 
            style="width:100%;height: auto;"
            :row-class-name="tableRowClassName"
            >
            <el-table-column align="left" label="序号" type="index" ></el-table-column>
            <el-table-column align="left" label="日期" prop="courseDay" ></el-table-column>
            <el-table-column align="left" label="上课时间" prop="date" >
                <template slot-scope="scope">
                    <span>{{scope.row.courseStartTime}}{{scope.row.courseEndTime}} </span>
                </template>
            </el-table-column>
            <el-table-column align="left" label="教学内容" prop="courseContent" ></el-table-column>
            <el-table-column align="left" label="上课教室">
                <template slot-scope="scope">
                    <span>{{scope.row.classroomCode}}</span>
                    <br>
                    <span>({{scope.row.schoolArea}})</span>
                </template>
            </el-table-column>
            <el-table-column align="left" label="任课教师" prop="lecturerName" >
                <template slot-scope="scope">
                    <span>{{scope.row.lecturerName}}</span>
                    <br>
                    <span>({{scope.row.teacherType === '1' ? '主讲' : '辅导'}}老师)</span>
                </template>
            </el-table-column>
            <el-table-column align="left" label="签到情况" prop="signinStatus" ></el-table-column>
            <el-table-column align="left" label="结算情况（所在结算表）" prop="generaltableName" >
                <template slot-scope="scope">
                    <span>({{scope.row.generaltableId ? '已结算' : '未结算'}})</span>
                    <br>
                    <span v-show="scope.row.generaltableId">({{scope.row.generaltableName}})</span>
                </template>
            </el-table-column>
            <el-table-column align="left" label="金额" prop="chargesPrice" ></el-table-column>
        </el-table>
        </el-col>
    </el-row>
</div>
</template>
<style scoped>
.tf-infowarp {
  padding: 0 12px;
  margin-top: 20px;
  line-height: 26px;
}
.tf-infowarp div .m-right {
  float: right;
}
</style>
<style>
.el-table th,
.el-table tr.grayrow {
  background-color: #efefef;
}
</style>

<script src="./teacherSignIn.js"></script>



