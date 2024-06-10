import request from '@/utils/request'
export const baseTeamApi = {
  // 获取数据列表
  page: (body) => request({
    url: '/gw/op/v1/baseTeam',
    method: 'get',
    params: body
  }),
  // 批量删除
  batchdelete: (body) => request({
    url: '/gw/op/v1/baseTeam/batch/remove',
    method: 'put',
    data: body
  }),

  // 删除(某项)
  delById: (id) => request({
    url: '/gw/op/v1/baseTeam/' + id,
    method: 'delete'
  }),
  // 更新状态
  changeStatus: (body) => request({
    url: '/gw/op/v1/baseTeam/status',
    method: 'put',
    data: body
  }),

  // 获取详情
  getDetailById: (id) => request({
    url: '/gw/op/v1/baseTeam/' + id,
    method: 'get'
  }),
  // 新增
  add: (body) => request({
    url: '/gw/op/v1/baseTeam',
    method: 'post',
    data: body
  }),
  // 更新
  update: (body) => request({
    url: '/gw/op/v1/baseTeam',
    method: 'put',
    data: body
  }),
  // 下拉
  getList: (body) => request({
    url: '/gw/op/v1/baseTeam/getList',
    method: 'get'
  })
}
