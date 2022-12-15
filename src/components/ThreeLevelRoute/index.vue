<template>
  <div class="page-content">
    <template v-if="!showThreeRouter">
      <slot></slot>
    </template>
    <template v-else>
      <router-view/>
    </template>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters([
        'showThreeRouter'
      ])
    },
    mounted() {
      if (this.$route.meta && this.$route.meta.routerId == 3) {
        this.$store.dispatch('page/changePageType', { showThreeRouter: true })
      } else {
        this.$store.dispatch('page/changePageType', { showThreeRouter: false })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .page-content {
    height: 100%;
  }
</style>


