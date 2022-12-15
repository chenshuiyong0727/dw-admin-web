import request from '@/utils/request'

export const goodsInventoryApi = {
  // 获取数据列表
  page: (body) => request({
    url: '/gw/op/v1/goodsInventory',
    method: 'get',
    params: body
  }),
  // 获取数据列表
  pageGoods: (body) => request({
    url: '/gw/op/v1/goodsInventory/pageGoods',
    method: 'get',
    params: body
  }),
  // 批量删除
  batchdelete: (body) => request({
    url: '/gw/op/v1/goodsInventory/batch/remove',
    method: 'put',
    data: body
  }),

  // 删除(某项)
  delById: (id) => request({
    url: '/gw/op/v1/goodsInventory/' + id,
    method: 'delete'
  }),
  // 更新状态
  changeStatus: (body) => request({
    url: '/gw/op/v1/goodsInventory/status',
    method: 'put',
    data: body
  }),

  // 获取详情
  getDetailById: (id) => request({
    url: '/gw/op/v1/goodsInventory/' + id,
    method: 'get'
  }),
  // 新增
  add: (body) => request({
    url: '/gw/op/v1/goodsInventory',
    method: 'post',
    data: body
  }),
  // 上架商品
  shelvesGoods: (body) => request({
    url: '/gw/op/v1/goodsInventory/shelvesGoods',
    method: 'post',
    data: body
  }),
  // 更新
  update: (body) => request({
    url: '/gw/op/v1/goodsInventory',
    method: 'put',
    data: body
  })

}
