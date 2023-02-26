import request from '@/utils/request'
export const goodsBaseSizePriceApi = {
  // 获取数据列表
  page: (body) => request({
    url: '/gw/op/v1/goodsBaseSizePrice',
    method: 'get',
    params: body
  }),
  // 获取数据列表
  getPriceData: (body) => request({
    url: '/gw/op/v1/goodsBaseSizePrice/getPriceData',
    method: 'get',
    params: body
  }),
  // 批量删除
  batchdelete: (body) => request({
    url: '/gw/op/v1/goodsBaseSizePrice/batch/remove',
    method: 'put',
    data: body
  }),

  // 删除(某项)
  delById: (id) => request({
    url: '/gw/op/v1/goodsBaseSizePrice/' + id,
    method: 'delete'
  }),
  // 更新状态
  changeStatus: (body) => request({
    url: '/gw/op/v1/goodsBaseSizePrice/status',
    method: 'put',
    data: body
  }),

  // 获取详情
  getDetailById: (id) => request({
    url: '/gw/op/v1/goodsBaseSizePrice/' + id,
    method: 'get'
  }),
  // 新增
  add: (body) => request({
    url: '/gw/op/v1/goodsBaseSizePrice',
    method: 'post',
    data: body
  }),
  // 更新
  update: (body) => request({
    url: '/gw/op/v1/goodsBaseSizePrice',
    method: 'put',
    data: body
  })

}
