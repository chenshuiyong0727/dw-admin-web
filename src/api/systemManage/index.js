import request from '@/utils/request'

export const systemContainerApi = {
  // 角色权限管理
  roles: (body) => request({
    url: '/mock/9/gw/op/v1/sys/roles',
    method: 'get',
    params: body
  }),
  // 新增部门
  saveDepartments: (body) => request({
    url: '/gw/op/v1/sys/departments/saveDepartments',
    method: 'post',
    data: body
  }),
  // 修改部门
  updateDepartments: (body) => request({
    url: '/gw/op/v1/sys/departments/updateDepartments',
    method: 'post',
    loading: false,
    data: body
  }),
  // 获取部门详情
  getDepartmentsDetail: (body) => request({
    url: '/gw/op/v1/sys/departments/getDepartmentsById',
    method: 'get',
    params: body
  }),
  // 获取组织结构列表
  pageDepartmentsList: (body) => request({
    url: '/gw/op/v1/sys/departments/pageDepartmentsList',
    method: 'post',
    data: body
  }),
  // 修改状态
  updateDeptStatus: (body) => request({
    url: '/gw/op/v1/sys/departments/updateDeptStatus',
    method: 'post',
    data: body
  }),
  // 部门等级列表
  listLevelDepartments: (body) => request({
    url: '/gw/op/v1/sys/departments/listLevelDepartments',
    method: 'post',
    loading: false,
    data: body
  }),
  // 部门（树形）列表
  listTreeDepartments: (body) => request({
    url: '/gw/op/v1/sys/departments/listTreeDepartments',
    method: 'post',
    data: body
  }),
  // 岗位列表
  pageListOpPost: (body) => request({
    url: '/gw/op/v1/sys/post/pageListOpPost',
    method: 'post',
    data: body
  }),
  // 获取岗位详情
  getOpPostById: (body) => request({
    url: '/gw/op/v1/sys/post/getOpPostById',
    method: 'get',
    params: body
  }),
  // 修改岗位
  updatePost: (body) => request({
    url: '/gw/op/v1/sys/post/updatePost',
    method: 'post',
    data: body
  }),
  // 新增岗位
  savePost: (body) => request({
    url: '/gw/op/v1/sys/post/savePost',
    method: 'post',
    data: body
  }),
  // 更新岗位状态
  updatePostStatus: (body) => request({
    url: '/gw/op/v1/sys/post/updatePostStatus',
    method: 'post',
    data: body
  }),
  // 角色列表
  pageListOpRole: (body) => request({
    url: '/gw/op/v1/role/pageListOpRole',
    method: 'post',
    data: body
  }),
  // 系统列表
  getOpSystemList: (body) => request({
    url: '/gw/op/v1/role/getOpSystemList',
    method: 'post',
    data: body
  }),
  // 更新角色状态
  updateRoleStatus: (body) => request({
    url: '/gw/op/v1/role/updateRoleStatus',
    method: 'post',
    data: body
  }),
  // 获取角色权限详情
  getOpSysRoleById: (body) => request({
    url: '/gw/op/v1/role/getOpSysRoleById',
    method: 'get',
    params: body
  }),
  // 角色关联用户列表
  pageListOpRoleRelationUser: (body) => request({
    url: '/gw/op/v1/role/pageListOpRoleRelationUser',
    method: 'post',
    data: body
  }),
  // 权限（树形）列表
  listTreeFunctions: (body) => request({
    url: '/gw/op/v1/role/listTreeFunctions',
    method: 'post',
    data: body
  }),
  // 修改角色权限
  updateOpSysRole: (body) => request({
    url: '/gw/op/v1/role/updateOpSysRole',
    method: 'post',
    data: body
  }),
  // 新增角色权限
  saveOpSysRole: (body) => request({
    url: '/gw/op/v1/role/saveOpSysRole',
    method: 'post',
    data: body
  }),
  // 当前用户最新权限列表
  newPermissionsList: (body) => request({
    url: '/gw/op/v1/role/listCurrentUserPermissionsByUserId',
    method: 'get',
    params: body
  }),
  // 系统用户列表
  pageListOpUser: (body) => request({
    url: '/gw/op/v1/sys/users/pageListOpUser',
    method: 'post',
    data: body
  }),
  // 更新系统用户状态
  updateUserStatus: (body) => request({
    url: '/gw/op/v1/sys/users/updateUserStatus',
    method: 'post',
    data: body
  }),
  // 获取用户详情
  getOpSysUserById: (body) => request({
    url: '/gw/op/v1/sys/users/getOpSysUserById',
    method: 'get',
    params: body
  }),
  // 修改系统用户
  updateOpSysUser: (body) => request({
    url: '/gw/op/v1/sys/users/updateOpSysUser',
    method: 'post',
    data: body
  }),
  // 新增系统用户
  saveOpSysUser: (body) => request({
    url: '/gw/op/v1/sys/users/saveOpSysUser',
    method: 'post',
    data: body
  }),
  // 部门（下拉）列表
  listDropDownDepartments: (body) => request({
    url: '/gw/op/v1/sys/departments/listDropDownDepartments',
    method: 'post',
    data: body,
    loading: false
  }),
  // 岗位（下拉）列表
  listDropDownPosts: (body = {}) => request({
    url: '/gw/op/v1/sys/post/listDropDownPosts',
    method: 'post',
    data: body,
    loading: false
  }),
  // 权限角色（下拉）列表
  listDropDownRoles: (body, loading = true) => request({
    url: '/gw/op/v1/role/listDropDownRoles',
    method: 'post',
    data: body,
    loading
  }),
  // 用户重置密码
  resetUserPwd: (body) => request({
    url: '/gw/op/v1/sys/users/resetUserPwd',
    method: 'get',
    params: body
  }),
  // 获取用户个人账号信息
  getOpSysUserAccountInfoById: (body) => request({
    url: '/gw/op/v1/sys/users/getOpSysUserAccountInfoById',
    method: 'get',
    params: body
  }),
  // 获取用户个人账号登录ip信息
  queryOpSysUserLoginLogById: (body) => request({
    url: '/gw/op/v1/sys/users/queryOpSysUserLoginLogById',
    method: 'get',
    params: body
  }),
  // 修改系统用户密码
  updateUserPwd: (body) => request({
    url: '/gw/op/v1/sys/users/updateUserPwd',
    method: 'post',
    data: body
  }),
  // 部门用户树形列表
  listDropDownUsers: (body) => request({
    url: '/gw/op/v1/sys/users/listDropDownUsers',
    method: 'post',
    data: body
  }),
  // 系统列表
  findMenuTreePageByLazy: (body) => request({
    url: '/gw/op/v1/menu/findMenuTreePageByLazy',
    method: 'post',
    data: body
  }),
  // 新增
  add: (body) => request({
    url: '/gw/op/v1/menu',
    method: 'post',
    data: body
  }),
  // 更新
  update: (body) => request({
    url: '/gw/op/v1/menu',
    method: 'put',
    data: body
  }),
  // 获取角色权限详情
  getMenuDetail: (body) => request({
    url: '/gw/op/v1/menu/getMenuDetail',
    method: 'get',
    params: body
  }),
  // 批量删除
  batchdelete: (body) => request({
    url: '/gw/op/v1/menu/batch/remove',
    method: 'put',
    data: body
  }),

  // 删除(某项)
  delById: (id) => request({
    url: '/gw/op/v1/menu/' + id,
    method: 'delete'
  }),
  goCopy: (body) => request({
    url: '/gw/op/v1/menu/goCopy',
    method: 'post',
    data: body
  }),
  updateKeyList: (body) => request({
    url: '/gw/op/v1/menu/updateKeyList',
    method: 'put',
    data: body
  })
}

