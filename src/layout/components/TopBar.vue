<template>
  <div class="app-header">
    <div class="left-logo">
      <img src="../../resources/assets/images/logo.jpeg">
      <div>
        <h5>和家健脑</h5>
        <p>和家管理平台</p>
      </div>
    </div>
    <div class="middle-menu">
      <el-menu
        :default-active="activeMenu"
        background-color="#384a61"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="horizontal"
        @select="handleSelect"
      >
        <template v-for="path in topMenu">
          <el-menu-item v-if="!path.hidden" :key="path.topMenuId" :index="path.topMenuId.toString()">
            {{ path.title }}
          </el-menu-item>
        </template>
      </el-menu>
    </div>
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img src="../../resources/assets/images/default_user.png" class="user-avatar">
          <span class="user-name">{{ name ? name : userName ? userName : '系统用户' }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/myAccount">
            <el-dropdown-item>
              账号信息
            </el-dropdown-item>
          </router-link>
          <router-link to="/myAccount/changePassword">
            <el-dropdown-item>
              修改密码
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="switchSystem">
            <span style="display:block;">切换系统</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <wait-work-msg-dialog v-if="isShowTodayMsgDialog" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { pathList } from '@/router'
import variables from '@/resources/styles/variables.scss'
import { getCookieByName } from '@/utils/auth'
export default {
  components: {
  },
  data() {
    return {
      pathList,
      isShowTodayMsgDialog: false,
      topMenu: [],
      userName: getCookieByName('user_name')
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name',
      'unreadMsg'
    ]),
    activeMenu() {
      const { matched } = this.$route
      const currentRouter = this.$router.options.routes.filter((item) => {
        if (item.meta && item.meta.leftMenuId) {
          return item.meta.leftMenuId == matched[0].meta.leftMenuId
        }
      })
      return currentRouter.length ? currentRouter[0].meta.leftMenuId.toString() : ''
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  mounted() {
    const functionList = sessionStorage.getItem('functionList') ? JSON.parse(sessionStorage.getItem('functionList')) : []
    const nodeMenu = functionList.filter(item => item.operationType === 'node' || item.operationType === 'icon')
    for (let i = 0; i < this.pathList.length; i++) {
      for (let j = 0; j < nodeMenu.length; j++) {
        if (this.pathList[i].title === nodeMenu[j].functionLabel) {
          this.topMenu.push(pathList[i])
        }
      }
    }
  //  this.queryTodayMsgUpcoming()
  },
  methods: {
    handleSelect(topMenuId) {
      let menuTitle = ''
      let currentRouterArr = []
      // let currentRouter = ''
      for (let i = 0; i < this.pathList.length; i++) {
        if (this.pathList[i].topMenuId == topMenuId) {
          menuTitle = this.pathList[i].title
        }
      }
      const functionList = sessionStorage.getItem('functionList') ? JSON.parse(sessionStorage.getItem('functionList')) : []
      const nodeLocationPath = functionList.filter(item => item.functionLabel == menuTitle && (item.operationType === 'node' || item.operationType === 'icon'))
      for (let i = 0; i < functionList.length; i++) {
        if (functionList[i].locationPath.indexOf(`${nodeLocationPath[0].locationPath}:`) > -1 && (functionList[i].operationType == 'list' || functionList[i].operationType == 'sub_list') && functionList[i].route) {
          // currentRouter = functionList[i]
          // break
          currentRouterArr.push(functionList[i])
        }
      }
      currentRouterArr.sort((a, b) => {
        return a.sort - b.sort
      })
      // this.$router.push({ path: currentRouter ? currentRouter.route : '/' })
      this.$router.push({ path: currentRouterArr[0] ? currentRouterArr[0].route : '/' })
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login`)
    },
    async switchSystem() {
      this.$router.push(`/login`)
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-header {
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #384a61;
    color: #fff;
    .left-logo {
      width: 210px;
      display: flex;
      align-items: center;
      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin: 0 10px 0 20px;
      }
      h5 {
        margin: 0;
        font-size: 16px;
      }
      p {
        margin: 0;
        padding-top: 5px;
        font-size: 14px;
      }
    }
    .middle-menu {
      flex: 1 1;
      padding-left: 50px;
      .el-menu {
        background-color: #384a61;
      }
      .el-menu.el-menu--horizontal {
        display: flex;
        .el-menu-item {
          font-size: 16px;
          font-weight: bold;
          color: #fff;
        }
      }
    }
    .right-menu {
      // width: 230px;
      text-align: right;
      display: flex;
      align-items: center;
      justify-content: space-between;
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
        color: #fff;
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
  }
</style>

