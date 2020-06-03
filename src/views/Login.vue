<template>
  <div id="paper">
    <el-form :model="loginForm" :rules="rules" class="login-container" label-position="left"
             label-width="0px" v-loading="loading">
      <h1 class="login_title" style="font-family: JMXMK,monospace">仓库管理系统</h1>
      <el-form-item prop="username">
        <el-input type="text" v-model="loginForm.identityID"
                  auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="loginForm.password"
                  auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item style="width: 100%">
        <el-button type="primary" style="width: 40%;background: #505458;border: none" v-on:click="login">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import qs from 'qs'
export default {
  name: 'Login',
  data () {
    return {
      rules: {
        identityID: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      },
      checked: true,
      loginForm: {
        identityID: '',
        password: ''
      },
      loading: false
    }
  },
  methods: {
    // 登录
    login () {
      const _this = this
      this.$axios.post('/user/web/login', qs.stringify(_this.loginForm))
        .then((response) => {
          if (response.data.code === 200) {
            const data = response.data.data
            _this.$store.commit('login', data)
            const path = _this.$route.query.redirect
            _this.$router.replace({ path: path === '/' || path === undefined ? '/main' : path })
          }
        })
    }
  }
}
</script>

<style scoped>
#paper {
  height: 100%;
  width: 100%;
  background-size: cover;
  position: fixed;
}
body{
  margin: 0;
}
.login-container {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 90px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
.login_title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}
.login_remember {
  margin: 0px 0px 35px 0px;
  text-align: left;
}
</style>
