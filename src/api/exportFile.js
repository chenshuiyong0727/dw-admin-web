import axios from 'axios'
import { getCookieByName } from '@/utils/auth'

export const getExport = (url,body, method = 'post') => {
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
      if (res.status === 200) {
        const fileName  = res.headers['content-disposition'] ? decodeURI(res.headers['content-disposition'].split(";")[1].split("=")[1].split("utf-8'zh_cn'")[1]) : '工单.xls'
        fileDownload(res.data, fileName)
        resolve()
      } else {
        console.log('请求错误')
      }
    })
  })
}
const fileDownload = (data, fileName)=>{
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
