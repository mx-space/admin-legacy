<template>
  <input :type="type || 'text'" v-model="text" @change="handleChange" />
</template>

<script lang="ts">
import Vue from 'vue'
import BaseInput from '@/components/Input/BaseInputMixin.vue'
export default Vue.extend({
  mixins: [BaseInput],
})
</script>

<style lang="scss" scoped>
input {
  border-bottom: 1px solid currentColor;
  box-sizing: border-box;
  padding: 0 0.3rem;
  line-height: 1.4;
  outline: 0;
  transition: border 0.5s;
  display: inline-block;
  &:hover,
  &:focus {
    border-bottom: 1px solid $yellow;
  }
}
</style>
