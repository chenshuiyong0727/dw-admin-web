import request from '@/utils/request'
export const userContainerApi = {
  // 用户登录
  login: (body) => request({
    url: '/gw/op/v1/auth/login',
    method: 'post',
    data: body
  }),
  // 获取验证码
  getVerificationCode: (body) => request({
    url: '/gw/op/v1/base/vc/login/getLoginVerityCode',
    method: 'post',
    loading: false,
    data: body
  }),
  // 延长令牌时间
  refresh: (body) => request({
    url: '/gw/op/v1/auth/token/refresh',
    method: 'post',
    data: body
  }),
  // 用户登出
  logout: (body) => request({
    url: '/gw/op/v1/sys/users/logout',
    method: 'get',
    params: body
  }),
  // 验证登录
  logincheck: (body) => request({
    url: '/gw/op/v1/sys/users/logincheck',
    method: 'post',
    data: body
  })
}

