<template>
  <div class="page-container">
    <h5>修改密码</h5>
    <el-row class="form-flex">
      <el-col :span="5">原密码：</el-col>
      <el-col :span="19">
        <el-input v-model="param.oldPwd" placeholder="原密码" show-password size="small"></el-input>
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="5">新密码：</el-col>
      <el-col :span="19">
        <el-input v-model="param.newPwd" placeholder="新密码" show-password size="small"></el-input>
      </el-col>
    </el-row>
    <el-row class="form-flex">
      <el-col :span="5">确认密码：</el-col>
      <el-col :span="19">
        <el-input v-model="param.confirmPwd" placeholder="确认密码" show-password
                  size="small"></el-input>
      </el-col>
    </el-row>
    <el-row class="button" type="flex" justify="center">
      <el-button type="primary" @click="modifyPwd">确认修改</el-button>
      <el-button type="text" @click="goBack">取消</el-button>
    </el-row>
  </div>
</template>

<script>
  import { systemContainerApi } from '@/api/systemManage'

  export default {
    data() {
      return {
        param: {
          oldPwd: '',
          newPwd: '',
          confirmPwd: ''
        }
      }
    },
    methods: {
      // handleClick(tab, event) {
      //   console.log(tab, event);
      // },
      modifyPwd() {
        let userId = localStorage.getItem('user_id')
        systemContainerApi.updateUserPwd({ ...this.param, id: userId }).then(async res => {
          if (res.subCode === 1000) {
            this.$message({
              message: '修改成功，即将重新登录',
              type: 'success'
            })
            await this.$store.dispatch('user/logout')
            this.$router.push(`/login`)
          } else {
            this.$message.error(res.subMsg)
          }
        })
      },
      goBack() {
        this.$router.go(-1)
      }
    }
  }
</script>


<style lang="scss" scoped>
  .page-container {
    width: 450px;
    margin-left: 30px;

    .el-row {
      margin-bottom: 15px;
    }

    h5 {
      font-size: 16px;
      margin-bottom: 20px;
    }

    .button {
      margin-top: 45px;
    }
  }
</style>

