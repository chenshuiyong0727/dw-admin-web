<template>
  <div :class="{'has-logo':showLogo}">
    <logo :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/resources/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      let showRoutesArr = this.$router.options.routes
      const { matched } = this.$route
      if (matched[1].meta.title == '用户关怀') {
        this.$store.dispatch('app/changeRouterAnimation', false)
      } else {
        this.$store.dispatch('app/changeRouterAnimation', true)
      }

      showRoutesArr = showRoutesArr.filter((item) => {
        if (item.meta && item.meta.leftMenuId) {
          return item.meta.leftMenuId === matched[0].meta.leftMenuId
        }
      })

      // 权限路由组合
      const fuctionList = localStorage.getItem('functionList') ? JSON.parse(localStorage.getItem('functionList')) : []
      const leftMenu = fuctionList.filter(item => item.functionType === 1 && item.operationType != 'node' && item.operationType != 'icon')
      let authRouter = []
      // 组合左侧一级路由
      for (let i = 0; i < showRoutesArr.length; i++) {
        for (let j = 0; j < leftMenu.length; j++) {
          if (showRoutesArr[i].meta.title === leftMenu[j].functionLabel && (leftMenu[j].operationType == 'stretch' || leftMenu[j].operationType == 'leaf_list')) {
            authRouter.push(showRoutesArr[i])
          }
        }
      }
      for (let i = 0; i < authRouter.length; i++) {
        // 组合左侧二级路由
        let secondRouter = []
        for (let j = 0; j < authRouter[i].children.length; j++) {
          for (let k = 0; k < leftMenu.length; k++) {
            if (authRouter[i].children[j].meta.title === leftMenu[k].functionLabel && (leftMenu[k].operationType === 'list' || leftMenu[k].operationType === 'leaf_list' || leftMenu[k].operationType === 'parent_list' || leftMenu[k].operationType === 'get' || leftMenu[k].operationType === 'put')) {
              secondRouter.push(authRouter[i].children[j])
            }
          }
        }
        authRouter[i].children = secondRouter
      }
      let hasThirdRoute =[]
      let leftAuthRouter = fuctionList.filter(item => item.route)
      for (let i = 0; i < authRouter.length; i++) {
        hasThirdRoute = authRouter[i].children ? authRouter[i].children.filter(item => item.children).length ? authRouter[i].children.filter(item => item.children) : '' : ''
        if (hasThirdRoute.length) {
          for (let j = 0; j < hasThirdRoute.length; j++) {
            // 如果有三级路由则组合左侧三级路由
            let thirdRoute = []
            for (let k = 0; k < hasThirdRoute[j].children.length; k++) {
              for (let l = 0; l < leftAuthRouter.length; l++) {
                let len = leftAuthRouter[l].route.split('/').length
                if (hasThirdRoute[j].children[k].path === leftAuthRouter[l].route.split('/')[len-1]) {
                  thirdRoute.push(hasThirdRoute[j].children[k])
                }
              }
            }
            // 数组对象去重
            let obj = {}
            thirdRoute = thirdRoute.reduce((cur, next) => {
              obj[next.name] ? '' : obj[next.name] = true && cur.push(next)
              return cur
            }, [])
            authRouter[i].children[j].children = thirdRoute
          }
        }
      }
      this.$store.dispatch('page/changeAuthorityRoute', {authorityRoute: authRouter})
      return authRouter
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      // return path
      const pathArr = path.split('/').slice(0, 3)
      return pathArr.join('/')
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
