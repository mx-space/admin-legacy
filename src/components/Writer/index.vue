<template>
  <el-form ref="form" :model="model" label-width="80px">
    <blur-input :value="model.title" @change="(e) => (title = e)" />
  </el-form>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import BlurInput from '@/components/Input/BlurInput.vue'
@Component({
  components: {
    BlurInput,
  },
})
export default class Writer extends Vue {
  model = {
    title: '',
    text: '',
  }
}
</script>
