<template>
  <PageLayout :options="options">
    <template #header>
      <Button
        @click.native="handleSubmit"
        :icon="['far', 'save']"
        backcolor="#2ecc71"
        name="保存"
      />
      <Button
        @click.native="handleSubmit"
        :icon="['far', 'save']"
        :name="$route.query.id ? '更新' : '发布'"
      />
    </template>
    <Writer
      :name="inputLabel"
      :title="model.title"
      :text="model.text"
      @change="onChange"
    />
    <template #footer>
      <button>
        <icon :icon="['fas', 'sliders-h']" />
      </button>
    </template>
  </PageLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import Button from '@/components/Button/LayoutButton.vue'
import PageLayout from '@/layouts/PageLayout.vue'
import Writer from '@/components/Writer/index.vue'
@Component({
  components: {
    Button,
    PageLayout,
    Writer,
  },
})
export default class PostWriteView extends Vue {
  options = {
    title: '撰写新文章',
  }
  inputLabel = '想想取个什么题目比较好呢~'
  model = {
    title: '',
    text: '',
  }
  handleSubmit() {}
  onChange(model: { title: string; text: string }) {
    this.model = { ...model }
  }
}
</script>
