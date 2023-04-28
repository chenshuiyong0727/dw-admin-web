import request from '@/utils/request'
export const goodsBusinessApi = {
  // 获取数据列表
  page: (body) => request({
    url: '/gw/op/v1/goodsBusiness',
    method: 'get',
    params: body
  }),
  // 批量删除
  batchdelete: (body) => request({
    url: '/gw/op/v1/goodsBusiness/batch/remove',
    method: 'put',
    data: body
  }),

  // 删除(某项)
  delById: (id) => request({
    url: '/gw/op/v1/goodsBusiness/' + id,
    method: 'delete'
  }),
  // 更新状态
  changeStatus: (body) => request({
    url: '/gw/op/v1/goodsBusiness/status',
    method: 'put',
    data: body
  }),

  // 获取详情
  getDetailById: (id) => request({
    url: '/gw/op/v1/goodsBusiness/' + id,
    method: 'get'
  }),
  // 新增
  add: (body) => request({
    url: '/gw/op/v1/goodsBusiness',
    method: 'post',
    data: body
  }),
  // 更新
  update: (body) => request({
    url: '/gw/op/v1/goodsBusiness',
    method: 'put',
    data: body
  })

}
