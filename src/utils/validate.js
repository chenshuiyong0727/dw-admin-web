/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {obj} propObj 验证的字段
 * @param {Array} nonRequiredField 非必填字段
 * @returns {Array}
 */
export function validNull(propObj, nonRequiredField = []) {
  let { keys } = Object
  let result = []
  for (let key of keys(propObj)) {
    if (!propObj[key] && !nonRequiredField.includes(key)) {
      result.push(key)
    }
  }
  return result
}
