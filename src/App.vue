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
    window.addEventListener('resize', debounce(this.updateViewport, 13))
  },
  methods: {
    ...mapActions('app', ['updateViewport']),
  },
})
</script>
<style lang="scss"></style>
