import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/resources/styles/index.scss' // global css
import App from './App'
import store from './store'
import router from './router'

import '@/resources/icons' // icon
import '@/permission' // permission control
import '@/directive'
import '@/utils/filter'
import VCharts from 'v-charts-v2'

import { objMerge } from '@/utils'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)
Vue.use(VCharts)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created() {
    // 解决vuex的state数据在页面刷新时会被重置的问题，持久化数据
    // 在页面加载时读取localStorage里的状态信息
    if (localStorage.getItem('store')) {
      let store = localStorage.getItem('store')
      this.$store.replaceState(
        objMerge(JSON.parse(store == null ? '' : store), this.$store.state))
    }
    // 在页面刷新时将vuex里的信息保存到localStorage里
    window.addEventListener('beforeunload', (event) => {
      let state = JSON.stringify(this.$store.state)
      localStorage.setItem('store', state == null ? '' : state)
    })
  }
})
