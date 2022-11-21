<template>
  <div class="no-authority-container">
    <!-- <div class="header-container">
      <div class="left-menu el-dropdown">
        <span @click="logout">如有需要请联系请系统管理员授权 </span>
      </div>
      <div class="right-menu">
        <el-dropdown class="avatar-container" >

        </el-dropdown>
      </div>
    </div> -->
    <img src="../resources/assets/images/noAuthority.jpg" width="330">
    <p class="font18 no-authority-p">您暂无权限操作系统<span class="signOut" @click="logout">  ,  退出系统</span></p>
  </div>
</template>

<script>
export default {
  name: 'NoAuthority',
  data() {
    return {
      loginName: localStorage.getItem('empName')
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login`)
    }
  }
}

</script>

<style lang="scss" scoped>
  .header-container{
    width:100%;
    height:50px;
    z-index: 999;
    position: fixed;
    bottom:0;
    background:#fff;
    padding:0 18px;
  }
  .left-menu {
    float: left;
    height: 50px;
    line-height:50px;
  }
  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
  &:focus {
     outline: none;
   }
  }
  .no-authority-container {
    width:100%;
    height:100%;
    background: #f4f4f4;
  }
  .no-authority-container > img{
    transform: translate(-50%, -50%);
    position: absolute;
    top: 40%;
    left: 50%;
  }
  .no-authority-p{
    transform: translate(-50%, -50%);
    position: absolute;
    font-weight: bold;
    top: 72%;
    left: 50%;
  }
  .signOut{
    color:#66b1ff;
  }
  .signOut:hover{
    cursor: pointer;
  }
</style>
