<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import debounce from 'lodash/debounce'
import { mapActions } from 'vuex'

export default Vue.extend({
  created() {
    this.updateViewport()
    this.fetchMaster()
    this.checkLogged()
    window.addEventListener('resize', debounce(this.updateViewport, 13))
  },
  methods: {
    ...mapActions('app', ['updateViewport']),
    ...mapActions('user', ['fetchMaster', 'clearData']),
    async checkLogged() {
      const { ok } = await this.$api('Master').get('check_logged')
      if (ok) {
        return true
      } else {
        this.$router.push('/login')

        return false
      }
    },
  },
})
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
#app {
  height: 100vh;
  width: 100vw;
  background-color: $deepBg;
  position: relative;
}
</style>
