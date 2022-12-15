import request from '@/utils/request'

export const reportApi = {
  // 获取数据列表
  putInStorage: (body) => request({
    url: '/gw/op/v1/report/putInStorage',
    method: 'get',
    params: body
  }),
  sellList: (body) => request({
    url: '/gw/op/v1/report/sellList',
    method: 'get',
    params: body
  })

}
