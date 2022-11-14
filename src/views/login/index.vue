<template>

  <div class="login-container">
    <div class="top">
      <img class="logo" src="../../resources/assets/images/logo.png" />
      <el-form ref="loginForm" :model="loginForm"  class="login-form" auto-complete="on" label-position="left">

        <div class="title-container">
          <h3 class="title">和家管理平台</h3>
        </div>

        <el-form-item prop="loginAccount">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
          <el-input
            ref="username"
            v-model="loginForm.loginAccount"
            placeholder="用户名"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="loginPassword">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.loginPassword"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
        </el-form-item>
        <el-row style="margin-bottom: 30px; position: relative">
          <el-col :span="14" class="code">
            <el-input
              v-model.trim="loginForm.verifyCode"
              maxlength="4"
              placeholder="验证码"
              tabindex="3"
              auto-complete="on">
            </el-input>
          </el-col>
          <el-col :span="10" class="code-img">
            <div v-if="isShowVerifyCode" id="code-container" @click="refreshCodeHandle"></div>
            <div v-else class="get-code-tip" @click="initVerifyCodeHandle">获取验证码</div>
          </el-col>
        </el-row>

        <el-button :loading="loading" type="primary" style="width:100%; height: 50px" @click.native.prevent="handleLogin">登录</el-button>
      </el-form>
    </div>

    <div class="bullshit__info">
      <a href="https://beian.miit.gov.cn/" target="_blank">闽ICP备16027237号-3</a>
    </div>
  </div>

</template>

<script>
import { userContainerApi } from '@/api/user'
import { GVerify } from '@/utils/code'
import { encrypt, deepCopy } from '@/utils'
import { initSysDict } from '@/utils/initRequest'
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        loginAccount: '',
        loginPassword: '',
        accountType: 1,
        loginSystem: '12',
        verifyCode: ''
      },
     /* loginRules: {
        loginAccount: [{ required: true, trigger: 'blur' }],
        loginPassword: [{ required: true, trigger: 'blur' }]
      },*/
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      verifyCodeObj: '',
      secretKey: '',
      redirectUrl: '',
      systemId: 0,
      isShowVerifyCode: false
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirectUrl = route.query && route.query.redirectUrl
        this.systemId = route.query && route.query.systemId
      },
      immediate: true
    }
  },
  created() {
    this.keyupSubmit()
  },
  mounted() {
    if (location.href.indexOf("#reloaded") == -1) {
      location.href = location.href + "#reloaded"
      location.reload()
    }
  },

  methods: {
    initVerifyCodeHandle() {
      if (!this.loginForm.loginAccount) {
        return this.$message.error('请先输入用户名')
      }
      this.isShowVerifyCode = true
      this.showVerifyCodeHandle()
    },
    keyupSubmit() {
      document.onkeydown = (e) => {
        let _key = window.event.keyCode
        if (_key === 13) {
          this.handleLogin()
        }
      }
    },
    showVerifyCodeHandle() {
      this.$nextTick(() => {
        this.verifyCodeObj = new GVerify({ id: 'code-container', ruleCode: '' })
        this.refreshCodeHandle()
      })

    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    // 获取验证码
    refreshCodeHandle() {
      if (!this.loginForm.loginAccount) {
        return this.$message.error('请先输入用户名')
      }
      userContainerApi.getVerificationCode({
        loginAccount: this.loginForm.loginAccount,
        loginSystem: this.loginForm.loginSystem
      }).then(res => {
        if (res.subCode === 1000) {
          this.verifyCodeObj.refresh(res.data.verifyCode)
          this.secretKey = res.data.secretKey
        } else {
          this.$message.error(res.subMsg)
        }
      })
    },
    handleLogin() {
   // this.$refs.loginForm.validate(valid => {
     // if (valid) {
      if (!this.loginForm.loginAccount) {
        return this.$message.error('请先输入用户名')
      }
      if (!this.loginForm.loginPassword) {
        return this.$message.error('请先输入密码')
      }
      if (!this.loginForm.verifyCode) {
        return this.$message.error('请填写验证码')
      } else if ((this.loginForm.verifyCode && !this.verifyCodeObj) || !this.verifyCodeObj.validate(this.loginForm.verifyCode)) {
        return this.$message.error('验证码错误！')
      }
      this.loading = true
      let loginInfo = deepCopy(this.loginForm)
      loginInfo.loginPassword = encrypt(loginInfo.loginPassword, this.secretKey)
      this.$store.dispatch('user/login', loginInfo).then((res) => {
        this.loading = false
        if (res.data) {
          // 初始化字典
          initSysDict().then(() => {
            const functionList = JSON.parse(sessionStorage.getItem('functionList'))
            const allRouter = functionList.filter(item => item.functionType == '1' && item.route)
            allRouter.sort((a, b) => {
              return a.sort - b.sort
            })
            const isHasRouterAuth = functionList.filter(item => item.functionType == '1' && item.route && item.route == this.redirect)
            if (!isHasRouterAuth.length) {
              this.redirect = allRouter[0].route
            }
            this.$router.push({ path: '/goodsBase' || this.redirect })
            // this.$router.push({ path: this.redirect || '/systemClass' })
            // if (this.redirectUrl && this.systemId && this.systemId != 0) {
            //   this.$router.push({ path: '/systemClass', query: { redirectUrl: this.redirectUrl, systemId: this.systemId }})
            // } else {
            //   this.$router.push('/systemClass')
            // }
          })
        } else {
          this.$message.error(res.subMsg)
          this.refreshCodeHandle()
        }
      }).catch(() => {
        this.loading = false
      })
    // } else {
    //   this.$message.error('账号密码不能为空')
    //   return false
    // }
 // })
    }
    // handleCheckLogin() {
    //   userContainerApi.logincheck({}).then(res => {
    //     if (res.subCode === 104) {
    //       console.info(res.subMsg)
    //       this.$store.dispatch('user/logout')
    //     }
    //   })
    // }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item, .code {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .code-img {
    text-align: right;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  // background-color: $bg;
  background: url(../../resources/assets/images/bg.png) no-repeat center center;
  overflow: hidden;

  .top {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 100px;
  }
  .bullshit__info {
    text-align: center;
    padding-top: 100px;
  }
  .logo {
    width: 196px;
    height: 69px;
    position: absolute;
    top: 45px;
    left: 45px;
  }
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 40px 35px 20px 35px;
    margin: 0 auto;
    overflow: hidden;
    background-color: $bg;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .get-code-tip {
    width: 160px;
    height: 49px;
    box-sizing: border-box;
    text-align: center;
    line-height: 49px;
    border-radius: 5px;
    background-color: rgba(64, 158, 255, 1);
    color: #fff;
    display: inline-block;
    cursor: pointer;
    font-size: 14px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  #code-container, .get-code-tip {
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
