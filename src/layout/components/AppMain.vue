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
