import request from "@/utils/request";
export const dictListApi = {
  // 字典类型列表
  getCodeList: (body) =>
    request({
      url: "/gw/op/v1/base/sys/dict/listSysDictType",
      method: "get",
      params: body,
    }),
  // 新增字典类型
  addDictItem: (body) =>
    request({
      url: "/gw/op/v1/base/sys/dict/dictType",
      method: "post",
      data: body,
    }),
  // 获取字典详情
  // 外面的这个
  getDictDetailById: (body) =>
    request({
      url: "/gw/op/v1/base/sys/dict/dictType",
      method: "get",
      params: body,
      splicing: true,
    }),
  // 获取字典详情 里面那个
  getInnerDictDetail: (body) =>
    request({
      url: "/gw/op/v1/base/sys/dict/dict",
      method: "get",
      params: body,
      splicing: true,
    }),
  // 更新字典类型（编辑）
  updateDict: (body) =>
    request({
      url: "/gw/op/v1/base/sys/dict/dictType",
      method: "put",
      data: body,
    }),
  // 删除字典类型
  deleteDictById: (id) =>
    request({
      url: "/gw/op/v1/base/sys/dict/dictType/" + id,
      method: "delete",
    }),

  // 新增字典
  addDict: (body) =>
    request({
      url: "/gw/op/v1/base/sys/dict/dict",
      method: "post",
      data: body,
    }),

  // 删除字典
  deleteDict: (id) =>
    request({
      url: "/gw/op/v1/base/sys/dict/dict/" + id,
      method: "delete",
    }),

  // 更新字典
  updateInnerDict: (body) =>
    request({
      url: "/gw/op/v1/base/sys/dict/dict",
      method: "put",
      data: body,
    }),
};
