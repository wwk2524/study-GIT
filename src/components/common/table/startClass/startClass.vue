<template>
  <div>
    <el-row>
        <div class="ins-opa-btn right">
        <el-button size="small" type="primary" round @click="getTableData"><span class="el-icon-search ins-s-mr-5"></span>查询</el-button>
        <el-button size="small" type="success" round @click="resetSearch">重置</el-button>
        </div>
        <div class="ins-search-con right">
        <el-input v-model="query" size="medium" placeholder="输入关键字" style="width:250px"></el-input>
        </div>
    </el-row>
    <br>
    <el-table :data="tableData" border stripe >
        <el-table-column align="left"  label="班级代码" prop="classInfo.classCode" width="200">
            <template slot-scope="scope">
            <span class="ins-table-card" @click="edit(scope.row)">{{scope.row.classInfo.classCode}}</span>
            </template>
        </el-table-column>
        <el-table-column align="left"  label="性质" prop="classInfo.natureName" ></el-table-column>
        <el-table-column align="left"  label="工种" prop="classInfo.specialtyName" ></el-table-column>
        <el-table-column align="left"  label="上课时间" prop="classInfo.classTime" ></el-table-column>
        <el-table-column align="left"  label="开班日期" prop="classInfo.startDate" width="200" >
            <template slot-scope="scope">
            {{$api.getDateAll(scope.row.classInfo.delayStartDate || scope.row.classInfo.startDate)}}
            <span v-if="canDelay(scope.row)" class="ins-table-card" @click="delay(scope.row)">延期</span>
            </template>
        </el-table-column>
        <el-table-column align="left"  label="预报名人数" prop="mNa_number" >
            <template slot-scope="scope">
            <span class="ins-table-card" @click="getStuList(scope.$index, scope.row,'signup')">{{scope.row.preStudentInfoList.length}}</span>
            </template>
        </el-table-column>
        <el-table-column align="left"  label="缴费人数" prop="mFee_number" >
            <template slot-scope="scope">
            <span class="ins-table-card" @click="getStuList(scope.$index, scope.row,'payment')">{{scope.row.payStudentInfoList.length}}</span>
            </template>
        </el-table-column>
        <el-table-column align="left"  label="状态" prop="status"  v-if="inhand">
            <template slot-scope="scope">
                <el-button v-if="scope.row.status === '1'" @click="showApprovFlow(scope.row)" plain size="mini" type="success" >{{getStatusLabel(scope.row.status)}}</el-button>
                <el-button v-else-if="scope.row.status === '3'" @click="showDismissal(scope.row)" plain size="mini" type="warning" >{{getStatusLabel(scope.row.status)}}</el-button>
                <el-button v-else-if="scope.row.status === '6'" @click="showDismissal(scope.row)" plain size="mini" type="warning" >{{getStatusLabel(scope.row.status)}}</el-button>
                <span v-else>{{getStatusLabel(scope.row.status)}}</span>

                <p v-show="parseInt(scope.row.status) === 0">{{getLockTime(scope.row.lockRemainingTime)}}</p>
            </template>
        </el-table-column>
        <el-table-column align="left"  label="操作" prop="otherField" width="230" v-if="inhand">
            <template slot-scope="scope">
            <el-button @click="edit(scope.row)" plain size="mini" type="success" v-show="getBtnSt(scope.row.status).editShow" :disabled="getBtnSt(scope.row.status).editDis">编辑</el-button>
            <el-button @click="changeStatus(scope.row,1)" plain size="mini" type="success" v-show="getBtnSt(scope.row.status).subShow" :disabled="getBtnSt(scope.row.status).subDis">提审</el-button>
            <el-button @click="changeStatus(scope.row,0)" plain size="mini" type="warning" v-show="getBtnSt(scope.row.status).cancelShow" :disabled="getBtnSt(scope.row.status).cancelDis">撤销</el-button>
            <el-button @click="changeStatus(scope.row,2)" plain size="mini" type="warning" v-show="getBtnSt(scope.row.status).closeShow" :disabled="getBtnSt(scope.row.status).closeDis">关闭</el-button>
            </template>
        </el-table-column>
    </el-table>
    <br>
    <div class="ins-tab-divide text-center">
        <el-pagination :current-page="page.page" :page-size="page.size" :page-sizes="page.sizeArr" :total="page.total" @current-change="pageChange" @size-change="sizeChange" layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
    </div>

    <el-dialog
        title="延期"
        :visible.sync="delayVisable"
        width="30%">
          <el-form :model="delayInfo"  ref="delayInfo" :rules="delayRule" label-width="200px">
            <el-form-item label="开班日期：" prop="delayStartDate" >
                <el-date-picker v-model="delayInfo.delayStartDate" type="date" format="yyyy 年 MM 月 dd 日" value-format="timestamp" placeholder="选择日期" style="width:200px"></el-date-picker>
                </el-form-item>
            <el-form-item label="结业日期：" prop="delayEndDate" >
                <el-date-picker v-model="delayInfo.delayEndDate" type="date" format="yyyy 年 MM 月 dd 日" value-format="timestamp" placeholder="选择日期" style="width:200px"></el-date-picker>
                </el-form-item>
            <el-form-item  label="截止报名日期：" prop="delayClosingUpDate" >
                <el-date-picker v-model="delayInfo.delayClosingUpDate" type="date" format="yyyy 年 MM 月 dd 日" value-format="timestamp" placeholder="选择日期" style="width:200px"></el-date-picker>
            </el-form-item>
            <el-form-item label="延期开班原因:"  :prop="'delayDesc'"  >
                <el-input v-model="delayInfo.delayDesc" style="width:200px"></el-input>
            </el-form-item>
          </el-form>
          <h3 style="color:#F56C6C">延期后，已排的课程会全部清空，请谨慎操作！</h3>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancelDelay">取 消</el-button>
            <el-button type="primary" @click="ensureDelay">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 报名人员、缴费人员列表 -->
    <el-dialog
      :title="dialogBaseInfo.title"
      :visible.sync="dialogVisable"
      width="50%">
        <el-table v-show="dialogBaseInfo.from === 'signup'" :data="dialogTableData" border stripe>
          <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column align="left"  label="学生姓名" prop="studentName" ></el-table-column>
            <el-table-column align="left"  label="手机号" prop="studentPhone" ></el-table-column>
            <el-table-column align="left"  label="身份证" prop="studentIdCard" ></el-table-column>
            <el-table-column   align="left"  label="申请预报名时间" prop="signupDate" >
              <template slot-scope="scope">
              <span>{{$api.getDateAll(scope.row.preSignupDate,'/')}}</span>
              </template>
            </el-table-column>
            <el-table-column align="left"  label="是否确认" >
               <template slot-scope="scope">
                    <el-switch
                      v-model="scope.row.isConfirm"
                       active-value="1"
                       inactive-value="0"
                      @change="confirmSigup(scope.row)"
                      active-color="#13ce66"
                      inactive-color="#ff4949">
                    </el-switch>
              </template>
            </el-table-column>
            <el-table-column align="left"  label="操作人" >
               <template slot-scope="scope">
                 <div v-show="scope.row.isConfirm === '1'">{{scope.row.confirmPersonName}}</div>
              </template>
            </el-table-column>
        </el-table>
        
        <el-table  v-show="dialogBaseInfo.from !== 'signup'" :data="dialogTableData" border stripe>
          <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column align="left"  label="学生姓名" prop="studentName" ></el-table-column>
            <el-table-column align="left"  label="手机号" prop="studentPhone" ></el-table-column>
            <el-table-column align="left"  label="身份证" prop="studentIdCard" ></el-table-column>
            <el-table-column   align="left"  label="申请预报名时间" >
              <template slot-scope="scope">
              <span>{{$api.getDateAll(scope.row.preSignupDate,'/')}}</span>
              </template>
            </el-table-column>
            <el-table-column align="left"  label="缴费时间">
              <template slot-scope="scope">
                <span>{{ $api.getDateAll(scope.row.signupDate,'/')}}</span>
              </template>
            </el-table-column>
        </el-table>

    </el-dialog>

    <!-- 审批流水 -->
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

      <!-- 驳回理由 -->
        <el-dialog
        :title="currentRow.dismissal === '3' ? '驳回理由' : '延期驳回理由'"
        :visible.sync="dismissalVisable"
        width="30%">
        <el-row>
                <span >{{currentRow.dismissal}}</span>
        </el-row>
        </el-dialog>







  </div>
</template>
<script src="./startClass.js"></script>



