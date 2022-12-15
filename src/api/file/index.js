import request from '@/utils/request'

export const fileApi = {
  // 获取详情
  // getImgUrl: (actNo) => request({
  //   url: '/gw/op/v1/file/getImgUrl/' + actNo,
  //   method: 'get'
  // }),
  getImgUrl: (body) => request({
    url: '/gw/op/v1/file/getImgUrl',
    method: 'get',
    params: body
  })
  // getImgUrl: (body) => request({
  //   url: '/gw/op/v1/file/getImgUrl',
  //   method: 'get',
  //   params: body
  // }),

}
