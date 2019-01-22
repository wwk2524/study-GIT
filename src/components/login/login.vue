<template>
    <div id="login" v-loading.fullscreen.lock="showLoading">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="UserName" prop="username">
            <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="PassWord" prop="password">
            <el-input type="password" v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="login('ruleForm')">Login</el-button>
            <el-button type="primary" @click="checkLogin">checkLogin</el-button>
            
        </el-form-item>
        </el-form>
    </div>
</template>

<style>
#login {
  height: 100%;
}
.logbar {
  width: 100%;
}
</style>

<script>
import api from "@/api/common/account";
export default {
  name: "login",
  data() {
    return {
      ruleForm: {
        username: null,
        password: null
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入手机号或者用户名",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入手机号或者用户名",
            trigger: "blur"
          }
        ]
      },
      showLoading: false
    };
  },
  methods: {
    login() {
      // 全局设置loadding
      this.showLoading = true;
      api
        .login({
          username: this.ruleForm.username,
          password: this.ruleForm.password
        })
        .then(requst => {
          if (requst.success === true) {
            this.$router.push("/home");
          } else {
            this.$message.error(requst.message, 3);
          }
          this.showLoading = false;
        })
        .catch(message => {
          this.$message.error(message);
          this.showLoading = false;
        });
    },
    checkLogin() {
      // 全局设置loadding
      api.checkLogin().then(requst => {
        if (requst.success === true) {
        } else {
          this.$message.error(requst.message, 3);
        }
      });
    }
  }
};
</script>
