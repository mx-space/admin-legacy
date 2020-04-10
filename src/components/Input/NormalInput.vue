<template>
  <div class="input-wrap">
    <input :type="type || 'text'" v-model="text" @change="handleChange" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import BaseInput from '@/components/Input/BaseInputMixin.vue'
export default Vue.extend({
  mixins: [BaseInput],
})
</script>

<style lang="scss" scoped>
.input-wrap {
  position: relative;
  overflow: hidden;
  margin: 2rem 0;
  width: 100%;
  input {
    padding: 0.5rem 0.8em;
    color: inherit;
    border-radius: 4px;
    border: #ccc 1px solid;
    line-height: 2;
    outline: none;
    font: inherit;
    width: 100%;
    background: none;
    vertical-align: middle;
    transition: border 0.5s;
    &:focus {
      border: #38a0d1 1px solid;
    }
  }
}
* {
  outline: none;
  border-radius: 3px;
  box-sizing: border-box;
}
</style>
