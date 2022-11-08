import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

// import newWindowRouter from './newWindowRouter'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

// 顶部导航菜单一级路由 从左到右顺序排列
export const pathList = [
/*  { title: '项目管理', topMenuId: 1 },
  { title: '用户管理', topMenuId: 2 },
  { title: '认知管理', topMenuId: 3 },
  { title: '运营管理', topMenuId: 4 },*/
  { title: '系统管理', topMenuId: 1 },
  { title: '我的账号', topMenuId: 2, hidden: true }
]
/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    redirect: '/systemClass',
    hidden: true
  },
  // 组织管理
  {
    path: '/organization',
    component: Layout,
    meta: { title: '组织管理', leftMenuId: 1 },
    redirect: '/organization/structure',
    children: [
      {
        path: 'structure',
        name: 'structure',
        component: () => import('@/views/systemManage/organization/organization'),
        meta: { title: '组织结构' },
        children: [
          {
            path: 'add',
            name: 'addOrganization',
            component: () => import('@/views/systemManage/organization/addOrganization'),
            meta: { title: '新增', routerId: 3 },
            hidden: true
          }
        ]
      },
      {
        path: 'job',
        name: 'job',
        component: () => import('@/views/systemManage/organization/job'),
        meta: { title: '岗位管理' },
        children: [
          {
            path: 'add',
            name: 'addJob',
            component: () => import('@/views/systemManage/organization/addJob'),
            meta: { title: '新增', routerId: 3 },
            hidden: true
          }
        ]
      }
    ]
  },
  // 权限管理
  {
    path: '/authority',
    component: Layout,
    meta: { title: '权限管理', leftMenuId: 1 },
    redirect: '/authority/role',
    children: [
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/systemManage/authority/role'),
        meta: { title: '角色权限' },
        children: [
          {
            path: 'add',
            name: 'addRole',
            component: () => import('@/views/systemManage/authority/addRole'),
            meta: { title: '新增', routerId: 3 },
            hidden: true
          }
        ]
      }
    ]
  },
  // 员工管理
  {
    path: '/staff',
    component: Layout,
    meta: { title: '员工管理', leftMenuId: 1 },
    redirect: '/staff/account',
    children: [
      {
        path: 'account',
        name: 'account',
        component: () => import('@/views/systemManage/staff/account'),
        meta: { title: '账号管理' },
        children: [
          {
            path: 'add',
            name: 'addAccount',
            component: () => import('@/views/systemManage/staff/addAccount'),
            meta: { title: '新增', routerId: 3 },
            hidden: true
          }
        ]
      }
    ]
  },
  // 菜单管理
  {
    path: '/menu',
    component: Layout,
    meta: { title: '菜单管理', leftMenuId: 1 },
    redirect: '/menu/list',
    children: [
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/systemManage/menu/list'),
        meta: { title: '菜单列表' }
      }
    ]
  },
  // 我的账号
  {
    path: '/myAccount',
    component: Layout,
    meta: { title: '我的账号', leftMenuId: 2 },
    redirect: '/myAccount/myInfo',
    children: [
      {
        path: 'myInfo',
        name: 'myInfo',
        component: () => import('@/views/accountManage/myInfo'),
        meta: { title: '个人信息' }
      },
      {
        path: 'changePassword',
        name: 'changePassword',
        component: () => import('@/views/accountManage/changePassword'),
        meta: { title: '修改密码' }
      }
    ]
  },
  {
    path: '/systemClass',
    component: () => import('@/views/systemClass'),
    hidden: true
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
