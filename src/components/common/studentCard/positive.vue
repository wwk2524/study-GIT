<template>
    <div>
        <el-row :gutter="10">
            <el-col style='width:332px;height:414px;' v-for='(item,index) in dataList' :key='index' class='mb20 card-con'>
                <div class="item">
                    <h4 class='text-center student-card-name'>
                        <!-- <div class='scn-con'><img src="../../../static/images/logo.png" class='student-logo' alt="" /> {{studentCardTitle}}</div> -->
                    </h4>
                    <div class='student-card-padding'>
                        <h3 class='text-center student-card-title'>学员卡</h3>
                        <p>工种：<span>{{item.specialty}}</span></p>
                        <p>班级代码：<span>{{item.classCode}}</span></p>
                        <p>学号：<span>{{item.studentCode}}</span></p>
                        <p>姓名：<span>{{item.studentName}}</span></p>
                        <p>身份证号：<span>{{item.studentIdCard}}</span></p>
                        <p>发票号码：<span>{{item.invoiceNum}}</span></p>
                        <p>开课地点：<span>{{item.classAddr}}</span></p>
                        <p>开课时间：<span v-if='item.startDate === null'>开课时进入公众号查看课表</span><span v-else>{{$api.getDateAll(item.startDate)}}</span></p>
                        <p>开课教室：<span v-if='item.startDate === null'>开课时进入公众号查看课表</span><span v-else>{{item.classroomCode}}</span></p>
                        <p>结业日期：<span>{{$api.getDateAll(item.endDate,'-')}}</span></p>
                        <p>联系电话：<span>{{item.contactNumber}}</span></p>
                        <div class='tips'>说明：</div>
                        <div class='tips-detail' v-html='studentCardDetail'></div>
                    </div>
                    <div class='photo'>
                        <img v-if='item.imageUrl' :style="{'background-image':'url('+item.imageUrl+')'}" class='uhr-img' border=0 alt="">
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<style scoped>
    .student-logo {
        width: 50px;
        height: 50px;
        vertical-align: middle;
    }

    .studentCardOper {
        line-height: 28px;
    }

    .studentCard {
        padding: 60px 100px;
    }

    .item {
        position: relative;
        padding: 0 0 18px;
        border: 1px solid #d2d2d2;
    }

    .back-item {
        border: 1px solid #d2d2d2;
        padding: 104px 30px 30px;
    }

    .student-card-title {
        font-size: 25px;
        color: rgba(77, 77, 77, 1);
        margin: 10px 0 5px;
    }

    .student-card-name {
        font-size: 14px;
        color: #fff;
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

    .student-card-padding {
        padding: 0 18px 0 26px
    }

    .scn-con {
        height: 63px;
        background: #0092F3;
        line-height: 63px;
    }

    .item p {
        margin-top: 2px;
        font-size: 12px;
        color: #4D4D4D;
        font-weight: bold;
    }

    .item p span {
        font-weight: 100;
    }

    .tips {
        margin: 10px 0 2px;
        font-weight: bold;
        font-size: 11px;
    }

    .tips-detail {
        font-size: 11px;
        font-weight: 100;
    }

    .photo {
        position: absolute;
        width: 69px;
        height: 96px;
        right: 15px;
        top: 110px;
        background: #f0f0f0;
        /* border: 4px solid #E5E5E5; */
    }

    .uhr-img {
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-size: cover;
        background-color: #fff;
        background-position: center;
    }

    .student-card-height {
        height: 414px;
    }
</style>
<script>
    export default {
      name: 'positive',
      props: {
        dataList: {
          type: Array,
          default: Array
        }
      },
      data () {
        return {
          data: {},
          studentCardTitle: '',
          studentCardPhone: '',
          studentCardDetail: ''
        }
      },
      mounted () {
        this.getBottom()
      },
      methods: {
        getBottom () {
          this.$ajax({
            method: 'post',
            url: 'baseInfo/parameter/getParaTree',
            data: { 'paraNames': ['studentCardTitle', 'studentCardDetail'] }
          }).then(res => {
            if (res.data.code === 1) {
              this.studentCardTitle = res.data.data.studentCardTitle.length !== 0 ? res.data.data.studentCardTitle[0].paraDesc : null
              this.studentCardDetail = res.data.data.studentCardDetail.length !== 0 ? res.data.data.studentCardDetail[0].paraDesc : null
            } else {
              this.$message.error(res.data.desc)
            }
          })
        }
      }
    }
</script>
