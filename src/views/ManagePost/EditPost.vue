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
    >
      <div class="url">
        <label class="prefix">{{ `${baseUrl}/${category.slug}/` }}</label>
        <UInput :value="slug" @change="(e) => (slug = e)" />
      </div>
    </Writer>

    <el-drawer title="我是标题" direction="rtl" :visible.sync="drawerOpen">
      <span>我来啦!</span>
    </el-drawer>

    <template #footer>
      <button @click="() => (drawerOpen = !drawerOpen)">
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
import UnderlineInput from '@/components/Input/UnderlineInput.vue'
import { Getter } from 'vuex-class'
import { Map } from 'immutable'
import { CategoryModel } from '../../store/interfaces/category.interface'
@Component({
  components: {
    Button,
    PageLayout,
    Writer,
    UInput: UnderlineInput,
  },
})
export default class PostWriteView extends Vue {
  @Getter
  categories!: Map<string, CategoryModel>

  options = {
    title: '撰写新文章',
  }
  inputLabel = '想想取个什么题目比较好呢~'
  model = {
    title: '',
    text: '',
  }
  drawerOpen = false

  handleSubmit() {}
  onChange(model: { title: string; text: string }) {
    this.model = { ...model }
  }

  get baseUrl() {
    return process.env.VUE_APP_WEB_URL
  }
  category: { name: string; slug: string } | {} = {}

  setDefaultCategory(): boolean {
    const defaultCategory = this.categories.first<CategoryModel>()
    if (!defaultCategory) {
      return false
    }
    this.category = {
      name: defaultCategory.name,
      slug: defaultCategory.slug,
    }
    return true
  }

  mounted() {
    let timer: number | null = setInterval(() => {
      const ok = this.setDefaultCategory()
      if (ok) {
        clearInterval(timer as number)
        timer = null
      }
    }, 100)
  }

  slug = ''
}
</script>
<style lang="scss" scoped>
.url {
  color: #666;

  input {
    width: 8rem;
  }
}
</style>
