<template>
<div>

    <el-table :data="tableData" class='lesson-detail-table' border  stripe >
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column align="left"  label="课程类型" prop="aaa" >
        <template slot-scope="scope">
            <span >
                {{parseInt(scope.row.courseType) ===  1 ? scope.row.smallclassName : '理论班' }}
            </span>
        </template>
        </el-table-column>

        <el-table-column v-if="!isEdit" align="left"  label="教学内容" prop="coursesContent" >
             <template slot-scope="scope">
                <span >{{scope.row.courseDetails[0].coursesContent}}</span>
            </template>
        </el-table-column>
        <el-table-column v-if="isEdit" align="left"  label="教学内容" prop="coursesContent" >
            <template slot-scope="scope">
                <span class="ins-table-card" @click="showLessonTip(scope.row)">{{scope.row.courseDetails[0].coursesContent || '编辑教学内容'}}</span>
            </template>
        </el-table-column>
        <el-table-column align="left"  label="组别" prop="m_group" >
        <template slot-scope="scope">
            <div class="tdcell" v-for="(item,idx) in scope.row.courseDetails" :key="idx">{{item.practiceGroup}}</div>
        </template>
        </el-table-column>
        <el-table-column align="left"  label="上课时间" prop="m_classTime" >
        <template slot-scope="scope">
            <p>{{parseTime(scope.row.courseDetails[0].courseStartTime,scope.row.courseDetails[0].courseEndTime).dayNa}}</p>
            <p>{{parseTime(scope.row.courseDetails[0].courseStartTime,scope.row.courseDetails[0].courseEndTime).sAndE}}</p>
        </template>
        </el-table-column>
        <el-table-column align="left"  label="教室类型" prop="m_classType" >
        <template slot-scope="scope">
            <div class="tdcell" v-for="(item,idx) in scope.row.courseDetails" :key="idx">{{item.classroomTypeName}}</div>
        </template>
        </el-table-column>

        <el-table-column align="left"  label="上课教室" prop="m_roomName" >
        <template slot-scope="scope">
            <div class="tdcell" v-for="(item,idx) in scope.row.courseDetails" :key="idx">{{item.classroomCode}}</div>
        </template>
        </el-table-column>
        <el-table-column align="left"  label="主讲老师" prop="m_keyTeacher" >
        <template slot-scope="scope">
            <div class="tdcell" v-for="(item,idx) in scope.row.courseDetails" :key="idx">{{item.lecturerName}}</div>
        </template>
        </el-table-column>
        <el-table-column align="left"  label="辅导老师" prop="m_counselor" >
        <template slot-scope="scope">
            <div class="tdcell" v-for="(item,idx) in scope.row.courseDetails" :key="idx">{{item.tutorName}}</div>
        </template>
        </el-table-column>
    </el-table>
     <!-- 编辑教学内容 -->
          <el-dialog
            title="提示"
            :visible.sync="lessonDialog"
            width="30%">
            <el-row>
              <el-form :model="currentRow" ref="currentRow" >
                  <el-form-item label="编辑教学内容:" prop="coursesContent" :rules="[{required:true, message:'必填', trigger:'blur'}, { max:30, message:'最多30个字符串！', trigger:'blur'}]">
                  <el-input v-model="currentRow.coursesContent" style="width:200px"></el-input>
                </el-form-item>
              </el-form>
            </el-row>
            <span slot="footer" class="dialog-footer">
              <el-button @click="cancelSave">取 消</el-button>
              <el-button type="primary" @click="saveLessonTip">确 定</el-button>
            </span>
          </el-dialog>
</div>
</template>
<style scoped>
.tdcell {
  border-top: 1px solid #ebeef5;
  margin-left: -12px;
  margin-right: -12px;
  text-align: center;
  padding-top: 8px;
  text-align: left;
  padding-left: 12px;
}
.tdcell:first-child {
  padding-top: 0;
  border: none;
}

</style>
<style>
    .lesson-detail-table  .el-table__body-wrapper {
        max-height: 600px;
        overflow-y: auto;
        width: 100%;
    }
</style>
<script src="./lessonDetail.js"></script>
