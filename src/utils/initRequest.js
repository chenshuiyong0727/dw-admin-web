import { commonApi } from '@/api/common'

export function initSysDict() {
  return new Promise((resolve) => {
    if (!localStorage.getItem('sysDictList')) {
      commonApi.listSysDict().then(res => {
        if (res.subCode === 1000) {
          localStorage.setItem('sysDictList', JSON.stringify(res.data))
          resolve()
        } else {
          this.$message.error(res.subMsg)
        }
      })
    } else {
      resolve()
    }
  })
}
