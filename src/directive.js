import Vue from 'vue'
import permission from './permission'

Vue.directive('permission', permission)

Vue.directive('enterNumber', {
  bind(el) {
    el.onkeypress = (event) => {
      return (/[\d]/.test(String.fromCharCode(event.keyCode || event.which)))
        || event.which === 8
    }
    el.oninput = () => {
      el.children[0].value = el.children[0].value.replace(/\D/ig, '')
    }
  }
})
Vue.directive('inputValidation', {
  bind(el, binding) {
    // binding.arg 传入自定义指令的参数 1=>输入纯数字 2=>输入数字和字母
    let reg = /[\d]/
    let replaceReg = /\D/ig
    if (binding.arg == 2) {
      reg = /^[A-Za-z0-9]*$/
      replaceReg = /[^A-Za-z0-9]+/ig
    }
    el.onkeypress = (event) => {
      return (reg.test(String.fromCharCode(event.keyCode || event.which)))
        || event.which === 8
    }
    el.oninput = () => {
      el.children[0].value = el.children[0].value.replace(replaceReg, '')
    }
  }
})
