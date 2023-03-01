<template>
  <section class="app-main-content">
    <transition :name="routeAnimation ? 'fade-transform' : ''"
                :mode="routeAnimation ? 'out-in' : ''">
      <router-view :key="key" v-if="routerAlive"/>
    </transition>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    },
    ...mapGetters([
      'routeAnimation'
    ])
  },
  data() {
    return {
      routerAlive: true
    }
  },
  provide() {
    return {
      routerRefresh: this.routerRefresh
    }
  },

  created() {
    // 在页面加载时读取sessionStorage里的状态信息
    if (localStorage.getItem('store')) {
      this.$store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(localStorage.getItem('store'))
        )
      )
    }
    // 在页面刷新时将vuex里的信息保存到localStorage里
    // beforeunload事件在页面刷新时先触发
    window.addEventListener('beforeunload', () => {
      localStorage.setItem('store', JSON.stringify(this.$store.state))
    })
  },
  methods: {
    routerRefresh() {
      this.routerAlive = false
      this.$nextTick(() => {
        this.routerAlive = true
      })
    }
  }
}
</script>

<style scoped>
  .app-main-content {
    /*50 = navbar  */
    /* min-height: calc(100vh - 50px); */
    width: 100%;
    position: relative;
    min-height: 100%;
    padding: 15px 20px;
  }

  .fixed-header + .app-main-content {
    padding-top: 50px;
  }
</style>

<style lang="scss">
  // fix css style bug in open el-dialog
  .el-popup-parent--hidden {
    .fixed-header {
      padding-right: 15px;
    }
  }
</style>
