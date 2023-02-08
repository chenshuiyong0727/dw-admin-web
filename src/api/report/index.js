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
  }),
  // 获取数据列表
  putInStorageDay: (body) => request({
    url: '/gw/op/v1/report/putInStorageDay',
    method: 'get',
    params: body
  }),
  // 获取数据列表
  putInStorageDayDetail: (body) => request({
    url: '/gw/op/v1/report/putInStorageDayDetail',
    method: 'get',
    params: body
  }),
  sellListDay: (body) => request({
    url: '/gw/op/v1/report/sellListDay',
    method: 'get',
    params: body
  })

}
