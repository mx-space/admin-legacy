<template>
  <PageLayout :options="options">
    <template #header>
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
      :id="id || 'post'"
      @change="onChange"
      ref="writer"
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
      <el-form :model="model" label-width="80px" label-position="top">
        <el-form-item label="分类">
          <el-select v-model="categoryId" placeholder="请选择">
            <el-option
              v-for="(value, key) in categoryRecord"
              :key="key"
              :label="value.name"
              :value="value._id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="标签">
          <el-tag
            :key="tag"
            v-for="tag in tags"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-autocomplete
            class="input-new-tag"
            v-if="inputVisible"
            v-model="newTagValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            :fetch-suggestions="querySearch"
            @select="handleSelect"
          >
          </el-autocomplete>
          <el-button
            v-else
            class="button-new-tag"
            size="small"
            @click="showInput"
            >+ 新标签</el-button
          >
        </el-form-item>

        <el-form-item label="概要">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入概要(Option)"
            v-model="summary"
          >
          </el-input>
        </el-form-item>
      </el-form>

      <el-form label-width="100px">
        <el-form-item label="隐藏?">
          <el-switch
            v-model="hide"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </el-form-item>

        <el-form-item label="Copyright?">
          <el-switch
            v-model="copyright"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </el-form-item>
      </el-form>
    </el-drawer>

    <template #footer>
      <button @click="handleDrawerOpen">
        <icon :icon="['fas', 'sliders-h']" />
      </button>
    </template>
  </PageLayout>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Mixins } from 'vue-property-decorator'
import Button from '@/components/Button/LayoutButton.vue'
import PageLayout from '@/layouts/PageLayout.vue'
import Writer, { BaseWriter } from '@/components/Writer/index.vue'
import UnderlineInput from '@/components/Input/UnderlineInput.vue'
import { Getter } from 'vuex-class'
import { CategoryModel } from '../../store/interfaces/category.interface'
import { PostRespDto } from '@/models/response.dto'

import { PostDto } from '../../models'

@Component({
  components: {
    Button,
    PageLayout,
    Writer,
    UInput: UnderlineInput,
  },
})
export default class PostWriteView extends Mixins(BaseWriter) {
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
  async handleDrawerOpen() {
    this.drawerOpen = !this.drawerOpen
    const { data } = await this.$api('Category').get(undefined, {
      params: {
        type: 'Tag',
      },
    })

    this.allExistTags = (data as any[]).map((item) => ({ value: item.name }))
  }
  async handleSelect() {
    this.handleInputConfirm()
  }
  async handleSubmit() {
    const model: PostDto = {
      ...this.model,
      slug: this.slug,
      categoryId: this.category._id,
      summary: this.summary === '' ? undefined : this.summary,
      hide: this.hide,
      copyright: this.copyright,
      tags: this.tags || [],
    }
    this.id
      ? await this.$api('Post').update(this.id as string, model)
      : await this.$api('Post').post(model)
    this.AfterSubmit()

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
    const entries = [...this.categories.entries()]
    this.categoryRecord = Object.fromEntries(entries)
    if (this.categoryId) {
      return true
    }
    const defaultCategory = entries.shift()?.[1]
    if (!defaultCategory) {
      return false
    }
    this.categoryId = defaultCategory._id

    return true
  }
  timer: number | null = null
  mounted() {
    if (this.categoryId) {
      return
    }
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
  }

  async created() {
    this.options.title = this.id ? '修改文章' : '撰写新文章'
    if (!this.id) {
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
      this.tags = data.tags || []
    }
  }

  showInput() {
    this.inputVisible = true
    this.$nextTick(() => {
      // @ts-ignore
      this.$refs.saveTagInput.$refs.input.focus()
    })
  }
  allExistTags = [] as any[]
  async querySearch(queryString, cb) {
    const allExistTags = this.allExistTags
    const results = queryString
      ? allExistTags.filter(this.createFilter(queryString))
      : allExistTags
    // 调用 callback 返回建议列表的数据
    cb(results)
  }
  createFilter(queryString) {
    return (tag) => {
      return tag.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    }
  }
  handleClose(tag: string) {
    this.tags.splice(this.tags.indexOf(tag), 1)
  }
  inputVisible = false
  newTagValue = ''
  handleInputConfirm() {
    const newTagValue = this.newTagValue
    if (newTagValue && !this.tags.includes(newTagValue)) {
      this.tags.push(newTagValue)
    }
    this.inputVisible = false
    this.newTagValue = ''
  }

  slug = ''
  summary = ''
  hide = false
  copyright = true
  prefix = 'mx-space-post'
  tags: string[] = []
}
</script>
<style lang="scss" scoped>
.url {
  color: #666;

  input {
    max-width: 18rem;
  }
}
</style>

<style lang="scss">
.el-tag + .el-tag {
  margin-left: 10px;
}
</style>
<style lang="scss" scoped>
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
