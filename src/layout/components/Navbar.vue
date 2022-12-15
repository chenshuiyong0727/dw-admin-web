<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container"/>

    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"> -->
        <img
          src="../../resources/assets/images/default_user.png"
          class="user-avatar"
        />
        <span class="user-name">{{
          name ? name : userName ? userName : '系统用户'
        }}</span>
        <i class="el-icon-caret-bottom"/>
      </div>
      <!--      <el-dropdown-menu slot="dropdown" class="user-dropdown">-->
      <!--        &lt;!&ndash;        <router-link to="/myAccount">-->
      <!--            <el-dropdown-item>-->
      <!--              账号信息-->
      <!--            </el-dropdown-item>-->
      <!--          </router-link>-->
      <!--          <router-link to="/myAccount/changePassword">-->
      <!--            <el-dropdown-item>-->
      <!--              修改密码-->
      <!--            </el-dropdown-item>-->
      <!--          </router-link>&ndash;&gt;-->
      <!--        <el-dropdown-item divided @click.native="switchSystem">-->
      <!--          <span style="display: block">切换系统</span>-->
      <!--        </el-dropdown-item>-->
      <!--        <el-dropdown-item divided @click.native="logout">-->
      <!--          <span style="display: block">退出登录</span>-->
      <!--        </el-dropdown-item>-->
      <!--      </el-dropdown-menu>-->
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
        <el-dropdown-item divided @click.native="logout">
          <span style="display:block;">退出登录</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <!-- <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              Home
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">Log Out</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div> -->
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'
  import { getCookieByName } from '@/utils/auth'

  export default {
    data() {
      return {
        userName: getCookieByName('user_name')
      }
    },
    components: {
      Breadcrumb,
      Hamburger
    },
    computed: {
      ...mapGetters(['sidebar', 'avatar', 'name'])
    },
    methods: {
      async logout() {
        await this.$store.dispatch('user/logout')
        this.$router.push(`/login`)
      },
      toggleSideBar() {
        this.$store.dispatch('app/toggleSideBar')
      }
      // async logout() {
      //   await this.$store.dispatch('user/logout')
      //   this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      // }
    }
  }
</script>

<style lang="scss" scoped>
  .avatar-container {
    float: right;
    margin-right: 70px;
    margin-top: 5px;
    color: #606266;

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

  .navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

    .hamburger-container {
      line-height: 46px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background 0.3s;
      -webkit-tap-highlight-color: transparent;

      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }

    .breadcrumb-container {
      float: left;
    }

    .right-menu {
      float: right;
      height: 100%;
      line-height: 50px;

      &:focus {
        outline: none;
      }

      // .right-menu-item {
      //   display: inline-block;
      //   padding: 0 8px;
      //   height: 100%;
      //   font-size: 18px;
      //   color: #5a5e66;
      //   vertical-align: text-bottom;

      //   &.hover-effect {
      //     cursor: pointer;
      //     transition: background .3s;

      //     &:hover {
      //       background: rgba(0, 0, 0, .025)
      //     }
      //   }
      // }

      // .avatar-container {
      //   margin-right: 30px;

      //   .avatar-wrapper {
      //     margin-top: 5px;
      //     position: relative;

      //     .user-avatar {
      //       cursor: pointer;
      //       width: 40px;
      //       height: 40px;
      //       border-radius: 10px;
      //     }

      //     .el-icon-caret-bottom {
      //       cursor: pointer;
      //       position: absolute;
      //       right: -20px;
      //       top: 25px;
      //       font-size: 12px;
      //     }
      //   }
      // }
    }
  }
</style>
