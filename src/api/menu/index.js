import request from '@/utils/request'

export function getRouterList(body) {
  return request({
    url: '/gw/op/v1/menu/getRouterList',
    method: 'post',
    data: body
  })
}
