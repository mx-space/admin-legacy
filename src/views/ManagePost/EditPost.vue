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

    <a-form layout="inline" :form="form" @submit="handleSubmit">
      <a-input
        placeholder="想想取个什么题目比较好呢~"
        v-decorator="[
          'title',
          { rules: [{ required: true, message: '标题是必须的' }] },
        ]"
        size="large"
        v-model="post.title"
      />
      <div class="url">
        <label>{{ prefix + categorySlug }}</label>
        <input type="text" class="slug" v-model="post.slug" />
      </div>

      <div
        :class="{
          'grid-half': !(device === 'mobile' || !options.preview),
          full: !options.preview,
        }"
      >
        <codemirror
          v-model="post.text"
          :options="cmOption"
          :events="cmEvents"
          @scroll="handleScroll"
          @focus="handleFocus"
          ref="code"
          :class="{ focus: options.focus }"
        />
        <article
          id="markdown-render"
          class="preview"
          v-html="md"
          v-if="device !== 'mobile' && options.preview"
          ref="preview"
        ></article>
      </div>
    </a-form>

    <a-drawer
      title="设定"
      placement="right"
      :closable="false"
      :visible="drawerVisible"
      :width="500"
      @close="() => (drawerVisible = false)"
    >
      <a-collapse default-active-key="1" :bordered="false">
        <a-collapse-panel header="文章附加选项" key="1">
          <div class="switch-item">
            <div class="switcher">
              <label>分类</label>
              <a-select
                style="width: 120px;"
                v-model="post.categoryId"
                @change="handleSelectCategory"
              >
                <a-select-option
                  :value="category._id"
                  v-for="category in this.categories"
                  :key="category._id"
                  >{{ category.name }}</a-select-option
                >
              </a-select>
            </div>
          </div>
          <div class="switch-item">
            <div class="switcher">
              <label>隐藏内容</label>
              <a-switch v-model="post.hide" />
            </div>
            <div class="desc">隐藏后, 内容对外人不可见</div>
          </div>

          <div class="switch-item">
            <div class="switcher">
              <label>概要</label>
            </div>
            <a-input v-model="post.summary" />
            <div class="desc">设置一个概要, 在文章列表页优先显示</div>
          </div>
          <div class="switch-item">
            <div class="switcher">
              <label>文章头图</label>
            </div>
            <div class="desc">添加一张文章头图</div>
          </div>
        </a-collapse-panel>
        <a-collapse-panel header="写作功能设定" key="2">
          <div class="switch-item">
            <div class="switcher">
              <label>显示预览</label>
              <a-switch
                v-model="options.preview"
                @change="handleSaveState('preview')"
              />
            </div>
            <div class="desc">启动右侧 Markdown 预览</div>
          </div>
          <div class="switch-item">
            <div class="switcher">
              <label>聚焦模式</label>
              <a-switch
                v-model="options.focus"
                @change="handleSaveState('focus')"
              />
            </div>
            <div class="desc">高亮显示当前行, 暗淡上下文区域</div>
          </div>

          <div class="switch-item">
            <div class="switcher">
              <label>打字机模式</label>
              <a-switch
                v-model="options.typewriter"
                @change="handleSaveState('typewriter')"
              />
            </div>
            <div class="desc">光标始终位于中心区域</div>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </a-drawer>

    <template #footer>
      <button @click="() => (drawerVisible = true)">
        <icon :icon="['fas', 'sliders-h']" />
      </button>
    </template>
  </PageLayout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {
  Form as AForm,
  Input as AInput,
  Drawer as ADrawer,
  Collapse as ACollapse,
  Switch as ASwitch,
  Upload as AUpload,
  Select as ASelect,
} from 'ant-design-vue'
import { codemirror } from 'vue-codemirror'
import MD from 'markdown-it'
import prism from 'markdown-it-prism'

import 'codemirror/mode/gfm/gfm'
import 'codemirror/addon/display/fullscreen'
import 'codemirror/theme/3024-day.css'
import 'codemirror/keymap/sublime'
import 'codemirror/addon/selection/active-line.js'
import 'codemirror-typewriter-scrolling/typewriter-scrolling'

import 'codemirror/lib/codemirror.css'
import '@/assets/scss/shizuku.scss'

import Button from '@/components/Button/LayoutButton'
import PageLayout from '@/layouts/PageLayout.vue'
import defaultSettings from '@/settings'
import { Rest } from '@/api'

import keymap from '@/core/keymap'

const prefix = 'focus_admin_'
const PERFER = Object.freeze({
  focus: 'focus_admin_mode_focus',
  typewriter: 'focus_admin_mode_typewriter',
  preview: prefix + 'preview',
})

const md = new MD({
  html: true,
  xhtmlOut: true,
}).use(prism)

const fieldComplete = (post) => {
  return {
    ...{
      slug: '',
      title: '',
      text: ``,
      hide: false,
      summary: '',
      categoryId: null,
    },
    ...post,
  }
}
// only for modify article
const fieldExtract = (post) => {
  // extract categoryId
  const { title, slug, text, status, summary, options } = post
  return {
    title,
    slug,
    text: text.trim(),
    status,
    summary,
    categoryId: post.categoryId?._id || null,
    options,
  }
}
export default {
  data() {
    return {
      options: {
        title: '撰写新文章',
        focus: !!parseInt(localStorage.getItem(PERFER.focus)) || false,
        typewriter:
          !!parseInt(localStorage.getItem(PERFER.typewriter)) || false,
        preview: !!parseInt(localStorage.getItem(PERFER.preview)) || false,
      },
      form: this.$form.createForm(this, { name: 'edit-form' }),
      post: {
        slug: '',
        title: '',
        text: ``,
        hide: false,
        summary: '',
        categoryId: '',
      },
      categories: [],
      postExtra: {
        img: null,
      },
      id: this.$route.query.id,
      drawerVisible: false,
      cmOption: {
        tabSize: 2,
        styleActiveLine: true,
        lineNumbers: true,
        lineWrapping: true,
        line: true,
        mode: 'text/x-gfm',
        theme: '3024-day',
        tokenTypeOverrides: {
          code: 'code',
        },
        typewriterScrolling:
          !!parseInt(localStorage.getItem(PERFER.typewriter)) || false,
        highlightFormatting: true,
        keymap: 'sublime',
        extraKeys: keymap,
      },
      cmEvents: ['scroll', 'viewportChange'],
    }
  },
  async created() {
    const isEdit = this.id || false
    if (isEdit) {
      const { data } = await Rest('getOne', 'Post')(isEdit)
      const title = `编辑 ${data.title}`
      this.options.title = title
      document.title = `${title} - ${defaultSettings.title}`

      this.post = Object.assign(data)
    } else {
      document.title = this.options.title
    }

    this.categories = await this.getCategory()
    this.post.categoryId = this.post.categoryId || this.categories[0]._id
  },
  components: {
    PageLayout,
    AForm,
    AInput,
    ADrawer,
    ACollapse,
    ACollapsePanel: ACollapse.Panel,
    ASwitch,
    ASelect,
    ASelectOption: ASelect.Option,
    Button,
    codemirror,
  },
  methods: {
    ...mapActions('category', ['getCategory', 'fetchCategory']),
    handleScroll(e) {
      if (this.device !== 'mobile' && this.options.preview) {
        const viewport = {
          top: e.lineAtHeight(e.display.scroller.getBoundingClientRect().top),
          bottom: e.lineAtHeight(
            e.display.scroller.getBoundingClientRect().bottom
          ),
        }

        const lineConut = e.lineCount()
        const curPos = viewport.top / lineConut
        const preview = this.$refs.preview
        const previewHeight = preview.scrollHeight
        preview.scrollTo({
          left: 0,
          top: curPos * previewHeight * 1.2,
        })
      }
    },
    async handleSubmit() {
      const id = this.$route.query.id
      const raw = {
        ...this.post,
        ...{ slug: this.post.slug },
        options: { ...this.postExtra },
      }

      const data = id ? fieldExtract(raw) : raw

      const res = id
        ? await Rest('modifyOne', 'Post')(id, data)
        : await Rest('postNew', 'Post')(data)

      if (id) {
        this.$message.success(res.msg)
      } else {
        this.$message.success('创建成功')
        this.$router.push({ name: 'view-posts' })
      }
    },
    handleSaveState(type) {
      localStorage.setItem(PERFER[type], this.options[type] ? 1 : 0)
    },
    handleFocus() {
      if (this.options.typewriter) {
        window.cm.execCommand('scrollSelectionToCenter')
      }
    },
    handleSelectCategory(e) {
      this.post.categoryId = e
    },
  },
  computed: {
    prefix() {
      return `${location.host}/posts/`
    },
    categorySlug() {
      return `${
        this.post.categoryId?.slug ||
        this.categories.find(
          (category) => category._id === this.post.categoryId
        )?.slug ||
        null
      }/`
    },
    md() {
      return md.render(this.post.text)
    },
    ...mapGetters(['device']),
  },
  mounted() {
    window.cm = this.$refs.code.codemirror
    setTimeout(() => {
      window.cm.setSize()
      window.cm.refresh()
    }, 2000)

    if (this.options.typewriter && this.post.text.split('\n').length < 20) {
      this.post.text = new Array(20).join('\n')
    }
  },
  watch: {
    'options.typewriter'(val) {
      if (val) {
        this.cmOption.typewriterScrolling = true
      } else {
        this.cmOption.typewriterScrolling = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.grid-half {
  display: grid;
  position: relative;
  grid-template-columns: 1fr 1fr;
}
.preview {
  height: 300px;
  overflow: auto;
  padding: 12px 2rem;
}
.preview.fullscreen {
  position: fixed;
  top: 0;
  left: 50%;
  right: 0;
  bottom: 0;
  height: auto;
  z-index: 9;
  background: #fff;
}

.slug {
  border: 0;
  border-bottom: 1px solid #aaaa;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
  display: inline-block;
  &:hover,
  &:focus {
    border-bottom: 1px solid;
    border-color: #40a9ff;
  }
}
.url {
  display: flex;
  margin: 0.8rem 0;
  line-height: 1.5;
}

@media (max-width: $small) {
  .slug {
    width: 5rem;
  }
}
.switch-item {
  display: flex;
  flex-direction: column;

  &:not(:last-child) {
    margin-bottom: 1.2rem;
  }
  > * {
    margin-bottom: 0.4rem;
  }
  .switcher {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .desc {
    color: inherit;
    opacity: 0.8;
    font-size: 0.9rem;
  }
}
</style>

<style lang="scss">
.CodeMirror-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 50%;
  bottom: 0;
  height: auto;
  z-index: 9;
}
.CodeMirror {
  border-radius: 4px;
}
@media (max-width: $small) {
  .CodeMirror-fullscreen {
    left: 0;
    right: 0;
  }
  .CodeMirror {
    height: 70vh;
  }
}
.full .CodeMirror-fullscreen {
  right: 0;
}
</style>
