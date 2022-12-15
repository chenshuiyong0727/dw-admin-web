import request from '@/utils/request'

export const goodsBaseApi = {
  // 获取数据列表
  page: (body) => request({
    url: '/gw/op/v1/goodsBase',
    method: 'get',
    params: body
  }),
  // 批量删除
  batchdelete: (body) => request({
    url: '/gw/op/v1/goodsBase/batch/remove',
    method: 'put',
    data: body
  }),

  // 删除(某项)
  delById: (id) => request({
    url: '/gw/op/v1/goodsBase/' + id,
    method: 'delete'
  }),
  // 更新状态
  changeStatus: (body) => request({
    url: '/gw/op/v1/goodsBase/status',
    method: 'put',
    data: body
  }),

  // 获取详情
  getDetailById: (id) => request({
    url: '/gw/op/v1/goodsBase/' + id,
    method: 'get'
  }),

  // 获取详情
  getImgUrl: (actNo) => request({
    url: '/gw/op/v1/file/getImgUrl/' + actNo,
    method: 'get'
  }),
  // getImgUrl: (body) => request({
  //   url: '/gw/op/v1/file/getImgUrl',
  //   method: 'get',
  //   params: body
  // }),
  // 新增
  add: (body) => request({
    url: '/gw/op/v1/goodsBase',
    method: 'post',
    data: body
  }),
  // 更新
  update: (body) => request({
    url: '/gw/op/v1/goodsBase',
    method: 'put',
    data: body
  }),
  // 尺寸（下拉）列表
  listDropDownSizes: (body, loading = true) => request({
    url: '/gw/op/v1/goodsBase/listDropDownSizes',
    method: 'post',
    data: body,
    loading
  })

}
