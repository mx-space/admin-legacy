<template>
  <PageLayout :options="options">
    <template #header>
      <Button
        @click.native="handleSave"
        :icon="['far', 'save']"
        backcolor="#2ecc71"
        name="保存"
      />
      <Button
        @click.native="handleSubmit"
        :icon="['fab', 'telegram-plane']"
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

    <el-drawer
      title="文章设定"
      direction="rtl"
      :visible.sync="drawerOpen"
      class="drawer"
    >
      <label>
        分类
      </label>
      <el-select v-model="categoryId" placeholder="请选择">
        <el-option
          v-for="(value, key) in categoryRecord"
          :key="key"
          :label="value.name"
          :value="value._id"
        >
        </el-option>
      </el-select>
      <label>概要</label>
      <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4 }"
        placeholder="请输入概要(Option)"
        v-model="summary"
      >
      </el-input>
      <span>隐藏?</span>
      <el-switch v-model="hide" active-color="#13ce66" inactive-color="#ff4949">
      </el-switch>
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
import { PostRespDto } from '@/models/response.dto'
import { MessageBox } from 'element-ui'
import { AutoSave } from '@/mixins/autosave'

@Component({
  components: {
    Button,
    PageLayout,
    Writer,
    UInput: UnderlineInput,
  },
})
export default class PostWriteView extends AutoSave {
  @Getter
  categories!: Map<string, CategoryModel>

  options = {
    title: '',
  }
  inputLabel = '想想取个什么题目比较好呢~'
  model = {
    title: '',
    text: '',
  }
  drawerOpen = false

  async handleSubmit() {
    const model = {
      ...this.model,
      slug: this.slug,
      categoryId: this.category._id,
      summary: this.summary === '' ? undefined : this.summary,
      hide: this.hide,
    }
    this.id
      ? await this.$api('Post').update(this.id as string, model)
      : await this.$api('Post').post(model)
    this.$notice.success('发布成功')
    this.$router.push('/posts')
  }
  onChange(model: { title: string; text: string }) {
    this.model = { ...model }
  }

  get baseUrl() {
    return process.env.VUE_APP_WEB_URL || 'http://localhost:2323'
  }
  categoryId = ''
  get category() {
    const category = this.categories.get(this.categoryId) || {
      slug: '',
      name: '',
    }
    return {
      _id: this.categoryId,
      slug: category.slug,
      name: category.name,
    }
  }
  categoryRecord: Record<string, CategoryModel> = {}
  setDefaultCategory(): boolean {
    const defaultCategory = this.categories.first<CategoryModel>()
    if (!defaultCategory) {
      return false
    }
    this.categoryId = defaultCategory._id

    this.categoryRecord = this.categories.toObject()
    return true
  }
  timer: number | null = null
  mounted() {
    this.timer = setInterval(() => {
      const ok = this.setDefaultCategory()
      if (ok) {
        clearInterval(this.timer as number)
        this.timer = null
      }
    }, 100)
  }

  beforeDestroy() {
    clearInterval(this.timer as number)
    this.timer = null
    // this.autoSaveTimer = clearInterval(this.autoSaveTimer)
  }
  get id() {
    return this.$route.query.id
  }

  async created() {
    this.options.title = this.id ? '修改文章' : '撰写新文章'
    if (!this.id) {
      // const savedData = localStorage.getItem(this.prefix)
      // if (savedData) {
      //   MessageBox.confirm('检测到保存的版本，是否读取？', '提示', {
      //     type: 'info',
      //   })
      //     .then(() => {
      //       const parseData = JSON.parse(savedData) as SavedDataType
      //       this.model = parseData.data
      //     })
      //     .catch(() => {})
      // }
      return
    } else {
      const { data } = await this.$api('Post').get<PostRespDto>(
        this.$route.query.id as string,
      )

      this.slug = data.slug
      this.summary = data.summary ?? ''
      this.model = {
        title: data.title,
        text: data.text,
      }
      this.hide = data.hide
      this.categoryId = data.categoryId

      // const savedData = localStorage.getItem(this.prefix + '-' + this.id)
      // if (savedData) {
      //   MessageBox.confirm('检测到保存的版本，是否读取？', '提示', {
      //     type: 'info',
      //   })
      //     .then(() => {
      //       this.model = (JSON.parse(savedData) as SavedDataType).data
      //     })
      //     .catch(() => {})
    }
  }
  slug = ''
  summary = ''
  hide = false

  // autoSaveTimer: any
  // handleSave() {
  //   this.$message.success('自动保存已开启')
  //   this.autoSaveTimer = setInterval(() => {
  //     const data = JSON.stringify({
  //       time: new Date().toISOString(),
  //       data: this.model,
  //     })
  //     if (this.id) {
  //       localStorage.setItem(this.prefix + '-' + this.id, data)
  //     } else localStorage.setItem(this.prefix, data)
  //   }, 3000)
  // }

  prefix = 'mx-space-post'
}
// interface SavedDataType {
//   time: string
//   data: {
//     title: string
//     text: string
//   }
// }
</script>
<style lang="scss" scoped>
.url {
  color: #666;

  input {
    width: 8rem;
  }
}
.drawer {
  label {
    display: block;
  }
  label,
  span {
    margin: 1rem 0;
  }
  span {
    display: inline-block;
    margin-right: 3rem;
  }
}
</style>
