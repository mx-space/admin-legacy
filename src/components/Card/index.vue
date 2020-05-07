<template>
  <div class="card" @click="$emit('click')"><slot /></div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
@Component
export default class Card extends Vue {}
</script>
<style lang="scss" scoped>
.card {
  height: 100%;
  width: 100%;
  margin-right: 12px;
  margin-bottom: 12px;
  border-radius: 24px;
  transition: transform 0.5s;
  display: inline-block;
  /* align-items: center; */
  /* justify-content: center; */
  text-align: center;
  line-height: 50px;
  user-select: none;
  &:active {
    transform: scale(0.9);
  }
}
</style>
