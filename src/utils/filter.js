import Vue from 'vue'
import { commonApi } from '@/api/common'
import DICT_KEYS from '@/utils/staticEnum'
import { parseTime } from './index'

// let sysDictList = []
// if (localStorage.getItem('sysDictList')) {
//   sysDictList = JSON.parse(localStorage.getItem('sysDictList'))
// } else {
//   commonApi.listSysDict().then(res => {
//     if (res.subCode === 1000) {
//       sysDictList = res.data
//       localStorage.setItem('sysDictList', JSON.stringify(res.data))
//     } else {
//       this.$message.error(res.subMsg)
//     }
//   })
// }
let sysDictList = localStorage.getItem('sysDictList') ? JSON.parse(
  localStorage.getItem('sysDictList')) : []
if (!sysDictList.length) {
  commonApi.listSysDict().then(res => {
    if (res.subCode === 1000) {
      sysDictList = res.data
      localStorage.setItem('sysDictList', JSON.stringify(res.data))
    } else {
      this.$message.error(res.subMsg)
    }
  })
}
Vue.filter('dictToDesc', (value, type) => {
  let res = sysDictList.filter(
    item => item.typeValue == DICT_KEYS[type] && item.fieldValue == value)
  return res.length ? res[0].fieldName : '--'
})
Vue.filter('dictToDescTypeValue', (value, type) => {
  let res = sysDictList.filter(
    item => item.typeValue == type && item.fieldValue == value)
  return res.length ? res[0].fieldName : '--'
})
Vue.filter('numFilter', (value) => {
  // 截取当前数据到小数点后两位
  let realVal = parseFloat(value).toFixed(2)
  return realVal
})
Vue.filter('formateTime', parseTime)
Vue.filter('DateDiff', (Date_start, Date_end) => {
  let aDate, oDate1, oDate2, iDays;
  Date_end = Date_end.split(" "); //将时间以空格划分为两个数组  第一个数组是 2019-05-20 第二个数组是 00：00：00
  aDate = Date_end[0].split("-"); //获取第一个数组的值
  oDate1 = new Date(aDate[0] , aDate[1] ,aDate[2]); //将前半个数组以-拆分，每一个是一个数值
  Date_start = Date_start.split(" ");
  aDate = Date_start[0].split("-");
  oDate2 = new Date(aDate[0] , aDate[1] , aDate[2]);
  iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数
  console('iDays ' - iDays)
  return iDays;
})
