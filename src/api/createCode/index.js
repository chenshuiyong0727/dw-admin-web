import request from '@/utils/request'

export const createCodeApi = {
  // 代码生成器列表
  getCodeList: (body) =>
    request({
      url: '/gw/op/v1/code/genTable',
      method: 'get',
      params: body
    }),
  // 批量删除代码生成器
  deleteCodeItems: (body) =>
    request({
      url: '/gw/op/v1/code/genTable/batch/remove',
      method: 'put',
      data: body
    }),

  // 删除代码生成器(某项)
  deleteCodeItem: (id) =>
    request({
      url: '/gw/op/v1/code/genTable/' + id,
      method: 'delete'
    }),

  // 导入数据库列表
  getDataBaseList: (body) =>
    request({
      url: '/gw/op/v1/code/genTable/getTables',
      method: 'get',
      params: body
    }),
  // 确认导入表
  confirmInsert: (body) =>
    request({
      url: '/gw/op/v1/code/genTable/importTables',
      method: 'post',
      data: body
    }),

  // 生成代码详情
  codeDetail: (body) =>
    request({
      url: '/gw/op/v1/code/genLogs/getByTableId',
      method: 'get',
      params: body,
      splicing: true
    }),

  // 导出生成代码
  exportCode: (body) =>
    request({
      url: '/gw/op/v1/code/genLogs/create',
      method: 'post',
      data: body
    }),

  // 根据字典类型编号得到字典列表
  getListById: (body) =>
    request({
      url: '/gw/op/v1/base/sys/dict/dict/page',
      method: 'get',
      params: body
    }),

  // 获取代码生成器详情
  getCodeDetailById: (body) =>
    request({
      url: '/gw/op/v1/code/genTable',
      method: 'get',
      params: body,
      splicing: true
    }),

  // 更新代码生成器
  updateCode: (body) =>
    request({
      url: '/gw/op/v1/code/genTable',
      method: 'put',
      data: body
    })
}
