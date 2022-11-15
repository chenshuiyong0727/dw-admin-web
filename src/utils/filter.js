import Vue from 'vue'
import { commonApi } from '@/api/common'
import DICT_KEYS from '@/utils/staticEnum'
import { parseTime } from './index'

// let sysDictList = []
// if (sessionStorage.getItem('sysDictList')) {
//   sysDictList = JSON.parse(sessionStorage.getItem('sysDictList'))
// } else {
//   commonApi.listSysDict().then(res => {
//     if (res.subCode === 1000) {
//       sysDictList = res.data
//       sessionStorage.setItem('sysDictList', JSON.stringify(res.data))
//     } else {
//       this.$message.error(res.subMsg)
//     }
//   })
// }
let sysDictList = sessionStorage.getItem('sysDictList') ? JSON.parse(sessionStorage.getItem('sysDictList')) : []
if (!sysDictList.length) {
  commonApi.listSysDict().then(res => {
    if (res.subCode === 1000) {
      sysDictList = res.data
      sessionStorage.setItem('sysDictList', JSON.stringify(res.data))
    } else {
      this.$message.error(res.subMsg)
    }
  })
}
Vue.filter('dictToDesc', (value, type) => {
  let res = sysDictList.filter(item => item.typeValue == DICT_KEYS[type] && item.fieldValue == value)
  return res.length ? res[0].fieldName : '--'
})
Vue.filter('dictToDescTypeValue', (value, type) => {
  let res = sysDictList.filter(item => item.typeValue == type && item.fieldValue == value)
  return res.length ? res[0].fieldName : '--'
})
Vue.filter('numFilter', (value) => {
  // 截取当前数据到小数点后两位
  let realVal = parseFloat(value).toFixed(2)
  return realVal
})
Vue.filter('formateTime', parseTime)
