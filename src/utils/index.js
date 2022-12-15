// import Vue from 'vue'
import CryptoJS from 'crypto-js'

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        // time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

/**
 * @param {word} 待加密字符串
 * @param {secret_key} 加密需要用到的字符串，取值为验证码接口中的密钥
 */
export function encrypt(word, secret_key) {
  let key = CryptoJS.enc.Utf8.parse(secret_key)
  let srcs = CryptoJS.enc.Utf8.parse(word)
  let encrypted = CryptoJS.AES.encrypt(srcs, key,
    { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
  return encrypted.toString()
}

/**
 * @param {word} 待解密字符串
 * @param {secret_key} 解密时需要用到的字符串，取值为验证码接口中的密钥
 */
export function decrypt(word, secret_key) {
  let key = CryptoJS.enc.Utf8.parse(secret_key)
  let decrypt = CryptoJS.AES.decrypt(word, key,
    { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
  return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}

/**
 * @param {pageRouter} 当前页面的路由（通过当前路由页面找到对应的页面按钮权限）
 * @returns
 * 按钮权限: post-添加 put-修改 delete-删除 get-单个查询 query-列表查询 export-导出 import-导入 batch_delete-批量删除 batch_modify-批量修改 reset-查询重置
 */
export function getButtonPermission(pageRouter) {
  const functionList = localStorage.getItem('functionList') ? JSON.parse(
    localStorage.getItem('functionList')) : []
  let currentLocationPath = ''
  functionList.filter((item) => {
    if (item.route === pageRouter) {
      if (item.operationType === 'jump') {
        currentLocationPath = item.otherLocationPath
      } else {
        currentLocationPath = item.locationPath
      }
    }
  })
  let buttonPermissionArr = []
  let searchBtn = []
  let upBtn = []
  let listBtn = []
  functionList.filter(item => {
    if (item.locationPath.indexOf(`${currentLocationPath}:`) > -1) {
      if (item.functionType == 2) {
        searchBtn.push(item.functionLabel)
      }
      if (item.functionType == 3) {
        upBtn.push(item.functionLabel)
      }
      if (item.functionType == 4) {
        listBtn.push(item.functionLabel)
      }
    }
  })
  buttonPermissionArr['searchBtn'] = searchBtn
  buttonPermissionArr['upBtn'] = upBtn
  buttonPermissionArr['listBtn'] = listBtn
  return buttonPermissionArr
}

/**
 * @param {obj} Object
 * @returns
 */
export function deepCopy(obj) {
  if (typeof obj !== 'object') return
  return JSON.parse(JSON.stringify(obj))
}

/**
 * @param {params} 需要格式化的参数
 * @returns
 */
export function formatParams(params) {
  params && Object.keys(params).forEach(key => {
    if (typeof params[key] === 'string') {
      params[key] = params[key].trim()
    } else if (typeof params[key] === 'object') {
      formatParams(params[key])
    }
  })
  return params
}

/**
 * 判断token是否即将过期
 * @param {*} time
 * @returns
 */
export function isTokenExpire(time) {
  let curTime = new Date().getTime()
  let tokenExpireTime = new Date(time).getTime()
  let expierTime = tokenExpireTime - curTime
  let getMinutesTime = expierTime < 0 ? -1 : new Date(expierTime).getMinutes()
  if (getMinutesTime >= 0 && getMinutesTime <= 5) {
    // 即将过期
    return 1
  } else if (getMinutesTime < 0) {
    // 已过期
    return 2
  }
}

/**
 * 多层级对象合并覆盖
 * @param {*} target
 * @returns
 */
export function objMerge(target = {}, source = {}) {
  let obj = target
  if (typeof target != 'object' || typeof source != 'object') {
    return source
  }
  for (let key in source) {
    if (target.hasOwnProperty(key)) {
      obj[key] = objMerge(target[key], source[key])
    } else {
      obj[key] = source[key]
    }
  }
  return obj
}

/**
 * 生成w唯一标识标准的uuid，且使用了随机种子
 * @returns
 */
export function uuid() {
  let d = new Date().getTime()
  if (window.performance && typeof window.performance.now === 'function') {
    d += performance.now()
  }
  let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
    function(c) {
      let r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
  return uuid
}

/**
 * 判断是否是基本数据类型
 * @param value
 */
function isPrimitive(value) {
  return (typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'symbol' ||
    typeof value === 'boolean')
}

/**
 * 判断是否是一个js对象
 * @param value
 */
function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]'
}

/**
 * 深拷贝一个值
 * @param value
 */
export function cloneDeep(value) {

  // 记录被拷贝的值，避免循环引用的出现
  let memo = {}

  function baseClone(value) {
    let res
    // 如果是基本数据类型，则直接返回
    if (isPrimitive(value)) {
      return value
      // 如果是引用数据类型，我们浅拷贝一个新值来代替原来的值
    } else if (Array.isArray(value)) {
      res = [...value]
    } else if (isObject(value)) {
      res = { ...value }
    }

    // 检测我们浅拷贝的这个对象的属性值有没有是引用数据类型。如果是，则递归拷贝
    Reflect.ownKeys(res).forEach(key => {
      if (typeof res[key] === 'object' && res[key] !== null) {
        //此处我们用memo来记录已经被拷贝过的引用地址。以此来解决循环引用的问题
        if (memo[res[key]]) {
          res[key] = memo[res[key]]
        } else {
          memo[res[key]] = res[key]
          res[key] = baseClone(res[key])
        }
      }
    })
    return res
  }

  return baseClone(value)
}

