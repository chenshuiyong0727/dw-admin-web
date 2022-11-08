<template>
  <div class="authority-container">
    <div class="right-menu">
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper">
            <img src="../resources/assets/images/default_user.png" class="user-avatar">
            <span class="user-name">{{ name ? name : userName ? userName : '系统用户' }}</span>
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
<!--
            <router-link to="/myAccount">
-->
              <el-dropdown-item @click.native="myAccount">
                账号信息
              </el-dropdown-item>
<!--
            </router-link>
-->
<!--
            <router-link to="/myAccount/changePassword">
-->
              <el-dropdown-item @click.native="changePassword">
                修改密码
              </el-dropdown-item>
<!--
            </router-link>
-->
            <el-dropdown-item divided @click.native="gologout">
              <span style="display:block;">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    <div class="wrapper">
      <div style="100%">
        <el-row class="select-sort">
          <el-col :span="4">系统选择:</el-col>
          <el-col :span="20">
            <el-select v-model="systemType" @change="changeValHandle">
              <el-option
                v-for="item in options"
                :key="item.fieldValue"
                :label="item.fieldName"
                :value="item.fieldValue">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row class="system-list" >
          <div  :class="['list', item.isHaveRole == 1 ? 'list-hasRole' : '']" @click="goHandle(item.systemUrl, item.systemId,item.isHaveRole)" v-for="item in systemList" :key="item.systemId">
            <img :src="item.icon" />
            <p>{{item.systemName}}</p>
          </div>
          <!-- <div class="list" @click="goMiniHandle()">,
            <img src="../resources/assets/images/wechat.png" />
            <p>小程序管理系统</p>
          </div>
          <div class="list" @click="goOrgunitHandle()" >
            <img src="../resources/assets/images/orgunitweb.png" />
            <p>组织管理系统</p>
          </div> -->
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { userContainerApi } from '@/api/user'
import { getCookieByName } from '@/utils/auth'
import DICT_KEYS from '@/utils/staticEnum'
const ColorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];
const  rnd = ((n, m) => {
  let random = Math.floor(Math.random()*(m-n+1)+n);
  return random
})
export default {
  name: 'Login',
  props: {
    userAvatar: {
      type: String,
      default: ''
    }
  },
  computed:{
    ...mapGetters([
      'avatar',
      'name',
    ]),
  },
  data() {
    return {
      accountFlag: 0,
      pasFlag: 0,
      sessionId: '',
      systemType: '1',
      redirect: '',
      redirectUrl: '',
      systemId: 0,
      options: [],
      systemList: [],
      color: ColorList[rnd(0,ColorList.length-1)] ,
      userName: getCookieByName('user_name')
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
  mounted() {
    if (!getCookieByName('session_id')) {
      sessionStorage.clear()
      location.reload()
    }
    let sysDictList = sessionStorage.getItem('sysDictList') ? JSON.parse(sessionStorage.getItem('sysDictList')) : []
    this.options = sysDictList.filter(item => item.typeValue == DICT_KEYS.SYSTEMSORT)
    this.systemList = sessionStorage.getItem('systemList') ? JSON.parse(sessionStorage.getItem('systemList')) : []
    for (let i = 0; i < this.systemList.length; i++) {
      if (this.systemList[i]['systemId'] == '4') {
        this.systemList[i]['icon'] = require('../resources/assets/images/logo.jpeg')
      } else {
        this.systemList[i]['icon'] = require('../resources/assets/images/icon-'+this.systemList[i].systemId+'.png')
      }
    }
    sessionStorage.setItem('systemList', JSON.stringify(this.systemList))
    this.handleCheckLogin()
  },
  methods: {
    // goOrgunitHandle() {
    //   this.$router.push({ path: '/organization/structure' })
    // },
    // goPlatHandle() {
    //   window.location.href = 'http://plate.server.com:18181/#/login?sessionId=' + getCookieByName('session_id')
    // },
    // goMiniHandle() {
    //   window.location.href = 'http://mini.server.com:18182?sessionId=' + getCookieByName('session_id')
    // },
    goHandle(url, sysId, isHaveRole) {
      if (isHaveRole == 0) {
        this.$message.error('暂无权限')
        return
      }
      if (sysId == 2) {
        const functionList = JSON.parse(sessionStorage.getItem('functionList'))
        const allRouter = functionList.filter(item => item.functionType == '1' && item.route)
        allRouter.sort((a, b) => {
          return a.sort - b.sort
        })
        const isHasRouterAuth = functionList.filter(item => item.functionType == '1' && item.route && item.route == this.redirect)
        if (!isHasRouterAuth.length) {
          this.redirect = allRouter[0].route
        }
        this.$router.push({ path: this.redirect })
      } else {
        if (this.redirectUrl && this.systemId && this.systemId != 0) {
          url = this.redirectUrl
        }
        url = url + '?sessionId=' + getCookieByName('session_id')
        window.location.href = url
      }
    },
    handleCheckLogin() {
      userContainerApi.logincheck({}).then(res => {
        if (res.subCode === 104) {
          console.info(res.subMsg)
          this.gologout()
        }
      })
    },
    changeValHandle(value) {
      if (value == 1) {
        // 全部
        this.systemList = sessionStorage.getItem('systemList') ? JSON.parse(sessionStorage.getItem('systemList')) : []
      } else {
        // 仅我有权限
        let sysList = sessionStorage.getItem('systemList') ? JSON.parse(sessionStorage.getItem('systemList')) : []
        this.systemList = sysList.filter(item => item.isHaveRole == 1)
      }
    },
    // setOptions() {
    //   this.options = [
    //     {
    //       value: '1',
    //       name: '全部'
    //     },
    //     {
    //       value: '2',
    //       name: '仅我有权限'

    //     }
    //   ]
    // },
    myAccount() {
      const functionList = sessionStorage.getItem('functionList') ? JSON.parse(sessionStorage.getItem('functionList')) : []
      const nodeMenu = functionList.filter(item => item.route)
      for (let i = 0; i < nodeMenu.length; i++) {
        if (nodeMenu[i].route === '/myAccount' || nodeMenu[i].route === '/myAccount/myInfo') {
          this.accountFlag = 1
        }
      }
      if (this.accountFlag === 1) {
        this.$router.push(`/myAccount`)
      } else {
        this.$message.error('暂无权限')
      }
    },
    changePassword() {
      const functionList = sessionStorage.getItem('functionList') ? JSON.parse(sessionStorage.getItem('functionList')) : []
      const nodeMenu = functionList.filter(item => item.route)
      for (let i = 0; i < nodeMenu.length; i++) {
        if (nodeMenu[i].route === '/myAccount/changePassword') {
          this.pasFlag = 1
        }
      }
      if (this.pasFlag === 1) {
        this.$router.push(`/myAccount/changePassword`)
      } else {
        this.$message.error('暂无权限')
      }
    },
    async gologout() {
      await this.$store.dispatch('user/logout').then(() => {
        sessionStorage.clear()
        location.reload()
        this.$router.push(`/login`)
      })
      sessionStorage.clear()
      location.reload()
      this.$router.push(`/login`)
    }
  }
}
</script>

<style lang="scss" scoped>
  .select-sort {
    width: 500px;
    margin: 40px auto;
    display: flex;
    align-items: center;
    .el-select {
      width: 100%;
    }
  }
  .system-list {
    width: 800px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    font-weight: bold;
    margin: 0 auto;
    .list {
      display: flex;
      align-items: center;
      flex-direction: column;
      cursor: pointer;
      position: relative;
      img {
        width: 180px;
        height: 180px;
        margin-bottom: 20px;
      }
    }
    .list-hasRole::after {
      content: '\6709\6743\9650';
      width: 70px;
      height: 28px;
      font-size: 16px;
      border-top-left-radius: 12px;
      border-bottom-right-radius: 12px;
      background: #419eff;
      text-align: center;
      line-height: 28px;
      color: #fff;
      position: absolute;
      top: 0;
      left: 0;
    }
  }

  .wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .right-menu {
    // width: 230px;
    text-align: right;
    display: flex;
    align-items: center;
    justify-content: space-between;
    float: right;
    padding: 20px 30px;
    .notification {
      font-size: 24px;
      margin-top: 10px;
    }
    .notifi-top {
      margin-top: 5px;
    }
    .doc-sty {
      margin: 0 20px;
    }
    .avatar-container {
      margin-right: 30px;
      .avatar-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        cursor: pointer;
        .user-name {
          padding-left: 5px;
        }
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }

        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 15px;
          font-size: 12px;
        }
      }
    }
    .el-icon-document {
      font-size: 26px;
      margin-left: 5px;
      cursor: pointer;
    }
  }
</style>
