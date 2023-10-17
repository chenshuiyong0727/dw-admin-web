import axios from 'axios'
import { hideLoading, showLoading } from '@/components/Loading/loading'
import { Message } from 'element-ui'

export const getExport = (url, body, method = 'post') => {
  showLoading()
  return new Promise((resolve) => {
    axios({
      url,
      data: body,
      method,
      responseType: 'blob',
      headers: {
        'tokenAuth': localStorage.getItem('org_token_auth')
      }
    }).then(res => {
      hideLoading()
      if (res.status === 200) {
        const fileName = res.headers['content-disposition'] ? decodeURI(
          res.headers['content-disposition'].split(';')[1].split('=')[1].split(
            'utf-8\'zh_cn\'')[1]) : '工单.xls'
        fileDownload(res.data, fileName)
        resolve()
      } else {
        console.log('请求错误')
      }
    }).catch(error => {
      console.log('请求错误 res', error)
      hideLoading()
      debugger
      // this.$message.error('导出失败')
      Message({
        message: error.msg || '导出失败',
        type: 'error',
        duration: 2 * 1000
      })
    })
  })
}
const fileDownload = (data, fileName) => {
  const blob = new Blob([data], {
    type: 'application/octet-stream'
  })
  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    window.navigator.msSaveBlob(blob, fileName)
  } else {
    var blobURL = window.URL.createObjectURL(blob)
    var tempLink = document.createElement('a')
    tempLink.style.display = 'none'
    tempLink.href = blobURL
    tempLink.setAttribute('download', fileName)
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank')
    }
    document.body.appendChild(tempLink)
    tempLink.click()
    document.body.removeChild(tempLink)
    window.URL.revokeObjectURL(blobURL)
  }
}
