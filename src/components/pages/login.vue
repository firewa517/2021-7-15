<template>
  <div class="login-bg">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="80px"
      class="demo-ruleForm login"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="ruleForm.username" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="ruleForm.password"
          clearable
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login('ruleForm')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getUserlogin } from "../../util/axios";
export default {
  data() {
    return {
      ruleForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 5,
            max: 20,
            message: "长度在 5 到 20 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //创建登录事件
    login(formInfo) {
      this.$refs[formInfo].validate((valid) => {
        if (valid) {
          //实际应该在这里调取接口
          getUserlogin(this.ruleForm)
            .then((res) => {
              console.log(res, "登录结果");
              if (res.data.code == 200) {
                this.$message.success(res.data.msg);
                sessionStorage.setItem('token',res.data.list.token)
                //登录成功 跳转到index页面
                this.$router.push("/index");
              } else if (res.data.code == 500) {
                this.$message.warning(res.data.msg);
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch((err) => {
              console.log(err, "错误捕获");
            });
        }
      });
    },
  },
};
</script>
<style lang="" scoped>
.login-bg {
  background: #314c69;
  /*  100vw=100% */
  width: 100vw;
  height: 100vh;
}
.login {
  padding: 40px 10px;
  width: 430px;
  height: 220px;
  background: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  margin: -150px 0 0 -150px;
  border-radius: 15px;
}
.el-input {
  width: 300px;
}
.el-button {
  margin: 20px 0 0 100px;
}
</style>