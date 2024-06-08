import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '@/layout'

// import newWindowRouter from './newWindowRouter'

Vue.use(Router)

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
  { title: '开发工具', topMenuId: 3 },
  // { title: '系统管理', topMenuId: 1 },
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
    redirect: '/homePage',
    hidden: true
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
    path: '/',
    component: Layout,
    meta: { title: '首页', leftMenuId: 3 },
    redirect: '/homePage',
    children: [
      {
        path: 'homePage',
        name: 'homePage',
        component: () => import('@/views/home/index'),
        meta: { title: '首页' }
      }
    ]
  },
  {
    path: '/goodsBase',
    component: Layout,
    meta: { title: '商品基本信息', leftMenuId: 3 },
    redirect: '/goodsBase/goodsInventory',
    children: [
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/goodsBase/list'),
        meta: { title: '商品基本信息' },
        children: [
          {
            path: 'detailNew',
            name: 'detailNew',
            component: () => import('@/views/goodsBase/detail-newV2'),
            meta: { title: '智能获取', routerId: 3 },
            hidden: true
          },
          {
            path: 'detail',
            name: 'detail',
            component: () => import('@/views/goodsBase/detail'),
            meta: { title: '详情', routerId: 3 },
            hidden: true
          }
        ]
      },
      {
        path: 'goodsInventory',
        name: 'goodsInventory',
        component: () => import('@/views/goodsInventory/list'),
        meta: { title: '商品库存' },
        children: [
          {
            path: 'detail',
            name: 'detail',
            component: () => import('@/views/goodsInventory/detail'),
            meta: { title: '详情', routerId: 3 },
            hidden: true
          // },
          // {
          //   path: 'dataDetail',
          //   name: 'dataDetail',
          //   component: () => import('@/views/goodsInventory/dataDetail'),
          //   meta: { title: '库存明细', routerId: 3 },
          //   hidden: true
          }
        ]
      },
      // {
      //   path: 'goodsInventoryDetail',
      //   name: 'goodsInventoryDetail',
      //   component: () => import('@/views/goodsInventory/listDetail'),
      //   meta: { title: '库存明细' },
      //   children: [
      //     {
      //       path: 'detail',
      //       name: 'detail',
      //       component: () => import('@/views/goodsInventory/detail'),
      //       meta: { title: '详情', routerId: 3 },
      //       hidden: true
      //     }
      //   ]
      // },
      // // {
      // //   path: 'dataDetail',
      // //   name: 'dataDetail',
      // //   component: () => import('@/views/goodsInventory/dataDetail'),
      // //   meta: { title: '库存明细' }
      // // },
      {
        path: 'dataDetail',
        name: 'dataDetail',
        component: () => import('@/views/goodsInventory/dataDetail'),
        meta: { title: '库存明细' }
      },
      {
        path: 'goodsDefects',
        name: 'goodsDefects',
        component: () => import('@/views/goodsDefects/list'),
        meta: { title: '瑕疵商品' },
        children: [
          {
            path: 'detail',
            name: 'detail',
            component: () => import('@/views/goodsDefects/detail'),
            meta: { title: '详情', routerId: 3 },
            hidden: true
          }
        ]
      }
    ]
  },
  {
    path: '/goodsOrder',
    component: Layout,
    meta: { title: '商品订单信息', leftMenuId: 3 },
    redirect: '/goodsOrder/list',
    children: [
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/goodsOrder/list'),
        meta: { title: '商品订单信息' },
        children: [
          {
            path: 'detail',
            name: 'detail',
            component: () => import('@/views/goodsOrder/detail'),
            meta: { title: '详情', routerId: 3 },
            hidden: true
          }
        ]
      },
      {
        path: 'list2',
        name: 'list2',
        component: () => import('@/views/goodsOrder/list2'),
        meta: { title: '已上架订单' }
      },
      {
        path: 'list3',
        name: 'list3',
        component: () => import('@/views/goodsOrder/list3'),
        meta: { title: '待发货订单' }
      },
      {
        path: 'list4',
        name: 'list4',
        component: () => import('@/views/goodsOrder/list4'),
        meta: { title: '已发货订单' }
      },
      {
        path: 'list5',
        name: 'list5',
        component: () => import('@/views/goodsOrder/list5'),
        meta: { title: '运输中订单' }
      },
      {
        path: 'list11',
        name: 'list11',
        component: () => import('@/views/goodsOrder/list11'),
        meta: { title: '闪电直发入仓' }
      },
      {
        path: 'list6',
        name: 'list6',
        component: () => import('@/views/goodsOrder/list6'),
        meta: { title: '已收货订单' }
      },
      {
        path: 'list7',
        name: 'list7',
        component: () => import('@/views/goodsOrder/list7'),
        meta: { title: '成功订单' }
      },
      {
        path: 'list8',
        name: 'list8',
        component: () => import('@/views/goodsOrder/list8'),
        meta: { title: '瑕疵订单' }
      },
      // {
      //   path: 'list9',
      //   name: 'list9',
      //   component: () => import('@/views/goodsOrder/list9'),
      //   meta: { title: '已下架订单' }
      // },


    ]
  },
  {
    path: '/report',
    component: Layout,
    meta: { title: '报表', leftMenuId: 3 },
    redirect: '/report/putInStorage',
    children: [
      {
        path: 'putInStorage',
        name: 'putInStorage',
        component: () => import('@/views/report/putInStorage'),
        meta: { title: '入库报表' },
        children: [
          {
            path: 'detail',
            name: 'detail',
            component: () => import('@/views/report/putInStorageDay'),
            meta: { title: '月份详情', routerId: 3 },
            hidden: true
          },
          {
            path: 'dayDetail',
            name: 'dayDetail',
            component: () => import('@/views/report/putInDetail'),
            meta: { title: '日期详情', routerId: 3 },
            hidden: true
          }
        ]
      },
      {
        path: 'sellList',
        name: 'sellList',
        component: () => import('@/views/report/sellList'),
        meta: { title: '销售报表' },
        children: [
          {
            path: 'detail',
            name: 'detail',
            component: () => import('@/views/report/sellListDay'),
            meta: { title: '详情', routerId: 3 },
            hidden: true
          }
        ]
      },
      {
        path: 'channelStorage',
        name: 'channelStorage',
        component: () => import('@/views/report/channelStorage'),
        meta: { title: '入库渠道报表' }
      },
      {
        path: 'areaSellList',
        name: 'areaSellList',
        component: () => import('@/views/report/areaSellList'),
        meta: { title: '区域销售报表' }
      },
      {
        path: 'giftReport',
        name: 'giftReport',
        component: () => import('@/views/report/giftReport'),
        meta: { title: '红包报表' }
      }
    ]
  },
  // 代码生成
  {
    path: '/',
    component: Layout,
    meta: { title: '系统管理', leftMenuId: 3 },
    redirect: '/code/list',
    children: [
      {
        path: '/menu/list',
        name: 'list',
        component: () => import('@/views/systemManage/menu/list'),
        meta: { title: '菜单列表' }
      },
      {
        path: '/authority/role',
        name: 'role',
        component: () => import('@/views/systemManage/authority/role'),
        meta: { title: '角色权限' }
      },
      {
        path: '/authority/role/add',
        name: 'addRole',
        component: () => import('@/views/systemManage/authority/addRole'),
        meta: { title: '新增' }
      },
      {
        path: '/organization/structure',
        name: 'structure',
        component: () => import('@/views/systemManage/organization/organization'),
        meta: { title: '组织结构' }
      },
      {
        path: '/organization/structure/add',
        name: 'addOrganization',
        component: () => import('@/views/systemManage/organization/addOrganization'),
        meta: { title: '新增', routerId: 3 }
      },
      {
        path: '/organization/job',
        name: 'job',
        component: () => import('@/views/systemManage/organization/job'),
        meta: { title: '岗位管理' }
      },
      {
        path: '/organization/job/add',
        name: 'addJob',
        component: () => import('@/views/systemManage/organization/addJob'),
        meta: { title: '新增', routerId: 3 }
      },
      {
        path: '/staff/account',
        name: 'account',
        component: () => import('@/views/systemManage/staff/account'),
        meta: { title: '账号管理' }
      },
      {
        path: '/staff/account/add',
        name: 'account',
        component: () => import('@/views/systemManage/staff/addAccount'),
        meta: { title: '新增' }
      },
      {
        path: '/code/list',
        name: 'list',
        component: () => import('@/views/codeCreate/index'),
        meta: { title: '代码生成器' }
      },
      {
        path: '/peisCode/list',
        name: 'list',
        component: () => import('@/views/peisCodeCreate/index'),
        meta: { title: '体检代码生成器' }
      },
      {
        path: '/code/dist',
        name: 'dist',
        component: () => import('@/views/dictManage/dictList'),
        meta: { title: '字典管理' }
      },
      {
        path: '/keyValue/list',
        name: 'keyValue',
        component: () => import('@/views/keyValue/list'),
        meta: { title: '键值对' },
        children: [
          {
            path: 'detail',
            name: 'detail',
            component: () => import('@/views/keyValue/detail'),
            meta: { title: '详情', routerId: 3 },
            hidden: true
          }
        ]
      }
    ]
  },
  // 更多
  {
    path: '/more',
    component: Layout,
    meta: { title: '更多', leftMenuId: 3 },
    redirect: '/more/goodsAct',
    children: [
      {
        path: 'goodsAct',
        name: 'goodsAct',
        component: () => import('@/views/goodsAct/list'),
        meta: { title: '活动' },
        children: [
          {
            path: 'detail',
            name: 'detail',
            component: () => import('@/views/goodsAct/detail'),
            meta: { title: '详情', routerId: 3 },
            hidden: true
          }
        ]
      },
      {
        path: 'goodsOther',
        name: 'goodsOther',
        component: () => import('@/views/goodsOther/list'),
        meta: { title: '其他收支' },
        children: [
          {
            path: 'detail',
            name: 'detail',
            component: () => import('@/views/goodsOther/detail'),
            meta: { title: '详情', routerId: 3 },
            hidden: true
          }
        ]
      },
      {
        path: 'gift',
        name: 'gift',
        component: () => import('@/views/gift/list'),
        meta: { title: '红包' },
        children: [
          {
            path: 'detail',
            name: 'detail',
            component: () => import('@/views/gift/detail'),
            meta: { title: '详情', routerId: 3 },
            hidden: true
          }
        ]
      },
      {
        path: 'memo',
        name: 'memo',
        component: () => import('@/views/memo/list'),
        meta: { title: '备忘录' },
        children: [
          {
            path: 'detail',
            name: 'detail',
            component: () => import('@/views/memo/detail'),
            meta: { title: '详情', routerId: 3 },
            hidden: true
          }
        ]
      },
    ]
  },
  // 更多
  {
    path: '/sport',
    component: Layout,
    meta: { title: '体育', leftMenuId: 3 },
    redirect: '/sport/baseTeam',
    children: [
      {
        path: 'baseTeam',
        name: 'baseTeam',
        component: () => import('@/views/sport/baseTeam/list'),
        meta: { title: '球队' },
        children: [
          {
            path: 'detail',
            name: 'detail',
            component: () => import('@/views/sport/baseTeam/detail'),
            meta: { title: '详情', routerId: 3 },
            hidden: true
          }
        ]
      },
    ]
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
