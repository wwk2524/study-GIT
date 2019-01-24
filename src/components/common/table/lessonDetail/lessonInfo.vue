<template>
<div>

    <el-table :data="courseInfo" border  stripe style='max-height:414px;overflow:auto'>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column align="left"  label="课程类型" prop="aaa" >
        <template slot-scope="scope">
            <span >
                {{parseInt(scope.row.courseType) ===  1 ? '实操'+ (scope.row.smallclassName || '未找到小班名') : '理论' }}
            </span>
        </template>
        </el-table-column>

        <el-table-column align="left"  label="教学内容" prop="coursesContent" >
             <template slot-scope="scope">
                <span >{{scope.row.courseDetails[0].coursesContent}}</span>
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

<script src="./lessonInfo.js"></script>
