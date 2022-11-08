// import { commonApi } from '@/api/common'
export default {
  employeeTypeList: [
    { key: '正式', value: 1 },
    { key: '试用', value: 2 }
  ],
  statusList: [
    { key: '禁用', value: 0 },
    { key: '正常', value: 1 },
    { key: '删除', value: -1 }
  ],
  isCredibleList: [
    { key: '不可信', value: 0 },
    { key: '可信', value: 1 },
    { key: '疑似代做', value: 2 }
  ],
  appointmentMethodList: [
    { key: '主动预约', value: 1 },
    { key: '客服代约', value: 2 }
  ],
  exportStatusList: [
    { fieldName: '未导出', fieldValue: 0 },
    { fieldName: '已导出', fieldValue: 1 }
  ],
  // 岗位分类
  JOB: 1,
  // 性别
  SEX: 2,
  // 员工类型
  EMPLOYEE: 3,
  // 服务能力标识
  SERVICE: 4,
  // 节点属性
  NODEPROPERTY: 6,
  // 目标角色
  TARGETROLE: 7,
  // 权限类型
  AUTHTYPE: 8,
  // 操作类型
  OPTYPE: 9,
  // 项目选择类型
  PROJECTTYPE: 10,
  // 项目跟进状态
  FLOWSTATUS: 11,
  // 筛查渠道
  SCREENINGCHANNEL: 12,
  // 健康状态
  HEALTHSTATUS: 13,
  // 认知筛查状态
  COGNITIONPROCESS: 14,
  // 企业类型
  COMPANYTYPE: 15,
  // 状态
  FILTERSTATUS: 16,
  // 优先级
  PRIORITY: 17,
  // 认知评估方案
  COGNITIVEASSESS: 2001,
  // 婚姻状况
  MARITALSTATUS: 3001,
  // 学历
  EDUCATION: 3002,
  // 民族
  NATIONALITY: 3003,
  // 筛查结果
  SCREENINGRES: 4005,
  // 初步结论
  PRELIMINARYCONCLUSIONS: 4003,
  // 系统分类
  SYSTEMSORT: 2022061301
}
