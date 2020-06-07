<!--
 * @Author: Innei
 * @Date: 2020-04-08 15:03:08
 * @LastEditTime: 2020-06-07 13:50:00
 * @LastEditors: Innei
 * @FilePath: /mx-admin/src/components/Input/BlurInput.vue
 * @Coding with Love
-->
<template>
  <div class="input-wrap">
    <input
      :type="type || 'text'"
      v-model="text"
      @change="handleChange"
      @blur="$emit('blur')"
    />
    <div class="blur"></div>
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
  input {
    position: relative;
    -webkit-text-fill-color: #eee;
    color: #eee;

    padding: 3px 12px;
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
  border-radius: 8px;
}
</style>
