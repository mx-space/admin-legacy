<template>
  <div class="input-wrap">
    <input :type="type || 'text'" v-model="text" @change="handleChange" />
    <div class="blur"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      text: this.value || '',
    }
  },
  props: ['value', 'type'],
  methods: {
    handleChange() {
      this.$emit('change', this.text)
    },
  },
})
</script>

<style lang="scss" scoped>
.input-wrap {
  position: relative;
  overflow: hidden;
  margin: 2rem 0;
  input {
    position: relative;
    -webkit-text-fill-color: #eee;
    color: #eee;

    padding: 1px 8px;
    line-height: 1.8;
  }
  .blur {
    mix-blend-mode: difference;
    position: absolute;
    top: -10px;
    bottom: -10px;
    right: -10px;
    left: -10px;
    background: #e6e6e686;
    filter: blur(10px);
    backdrop-filter: blur(10px) brightness(0.8);
    z-index: -1;
    transform: scale(1.5);
  }
}
* {
  outline: none;
  border-radius: 3px;
}
</style>
