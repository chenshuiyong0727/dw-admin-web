import request from '@/utils/request'

export const commonApi = {
  // 获取系统数据字典
  listSysDict: (body) => request({
    url: '/gw/op/v1/base/sys/dict/listSysDict',
    method: 'post',
    data: body,
    loading: false
  }),
  // 获取系统行政区域数据
  listSysAreas: (body, loading = true) => request({
    url: '/gw/op/v1/base/sys/area/listSysAreas',
    method: 'post',
    data: body,
    loading
  }),
  // 获取上传接口签名
  signature: (body, loading = true) => request({
    url: '/gw/op/v1/oss/upload/signature',
    method: 'get',
    params: body,
    loading
  }),
  // 文件上传成功后添加日志信息
  uploadDoLog: (body) => request({
    url: '/gw/op/v1/oss/upload/doLog',
    method: 'put',
    data: body,
    loading: false
  })
}
