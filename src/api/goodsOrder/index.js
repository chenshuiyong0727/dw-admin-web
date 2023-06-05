import request from '@/utils/request'

export const goodsOrderApi = {
  // 获取数据列表
  page: (body) => request({
    url: '/gw/op/v1/goodsOrder',
    method: 'get',
    params: body
  }),
  // 批量删除
  batchdelete: (body) => request({
    url: '/gw/op/v1/goodsOrder/batch/remove',
    method: 'put',
    data: body
  }),

  // 删除(某项)
  delById: (id) => request({
    url: '/gw/op/v1/goodsOrder/' + id,
    method: 'delete'
  }),
  // 更新状态
  changeStatus: (body) => request({
    url: '/gw/op/v1/goodsOrder/status',
    method: 'put',
    data: body
  }),

  // 获取详情
  getDetailById: (id) => request({
    url: '/gw/op/v1/goodsOrder/' + id,
    method: 'get'
  }),
  // 新增
  add: (body) => request({
    url: '/gw/op/v1/goodsOrder',
    method: 'post',
    data: body
  }),
  // 出售
  sellGoods: (body) => request({
    url: '/gw/op/v1/goodsOrder/sellGoods',
    method: 'post',
    data: body
  }),
  // 更新
  update: (body) => request({
    url: '/gw/op/v1/goodsOrder',
    method: 'put',
    data: body
  }),
  // 更新
  updateSaleType: (body) => request({
    url: '/gw/op/v1/goodsOrder/updateSaleType',
    method: 'put',
    data: body
  }),
  indexData: () => request({
    url: '/gw/op/v1/goodsOrder/indexData',
    method: 'get'
  }),
  indexOrderData: (body) => request({
    url: '/gw/op/v1/goodsOrder/indexOrderData',
    method: 'get',
    params: body
  }),
  todaySync: (body) => request({
    url: 'gw/op/v1/goodsOrder/todaySync',
    method: 'get',
    params: body
  })
}
