<!--
 * @Author: Innei
 * @Date: 2020-05-17 16:16:26
 * @LastEditTime: 2020-08-01 13:56:19
 * @LastEditors: Innei
 * @FilePath: /mx-admin/src/components/Writer/index.vue
 * @Coding with Love
-->
<template>
  <el-form ref="form" :model="model" label-width="80px" @submit.native.prevent>
    <material-input
      :value="model.title"
      :name="name"
      @change="handleChangeTitle"
      @keydown.enter.native.prevent="handleFocus"
      @composition="(b) => (composition = b)"
    />
    <div class="middle-content">
      <slot />
    </div>

    <div id="writer" ref="writer"></div>
  </el-form>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import NormInput from '@/components/Input/NormalInput.vue'
import MaterialInput from '../Input/MaterialInput.vue'
import { Prop, Watch } from 'vue-property-decorator'

import Vditor from 'vditor'

import '@/assets/scss/shizuku.scss'

@Component
export class BaseWriter extends Vue {
  AfterSubmit() {
    this.$emit('writer-submit')
    this.$notice.success((this.id ? '修改' : '发布') + '成功')
  }

  get id() {
    return this.$route.query.id
  }
}

declare const window: any
@Component({
  components: {
    NormInput,
    MaterialInput,
  },
})
export default class Writer extends Vue {
  created() {
    const model = {
      title: this.$props.title,
      text: this.$props.text,
    }
    this.$data.model = model
  }
  vditor!: Vditor
  // TODO: custom cache data (not only text but also title and raw data)
  handleUpdateText(value: string) {
    if (!this.vditor.vditor.options.cache?.enable) {
      this.vditor.enableCache()
    }
    this.model.text = value
    this.handleEmitChange()
  }
  beforeDestroy() {
    this.vditor.destroy()
    this.$events.$off('writer-submit')
  }
  mounted() {
    // @ts-ignore
    this.$events.$on('writer-submit', () => {
      console.log('clear cache.')

      this.vditor.clearCache()
      this.vditor.disabledCache()
    })
    const cachedKey = 'mx-space-writer' + (this.id ? `-${this.id}` : '')
    this.vditor = new Vditor(this.$refs['writer'] as HTMLElement, {
      after: () => {
        this.vditor.setValue(this.$props.text || '')
        const cachedData = localStorage.getItem(cachedKey)
        if (cachedData) {
          this.$confirm('检测到存在草稿, 是否加载')
            .then(() => {
              this.vditor.setValue(cachedData, true)
            })
            .catch(() => {})
        }
      },
      cache: {
        id: cachedKey,
        enable: false,
        after: this.handleUpdateText,
      },
      input: this.handleUpdateText,
      focus: this.handleUpdateText,
      preview: {
        hljs: {
          lineNumber: true,
        },
        markdown: {
          autoSpace: true,
          fixTermTypo: true,
          chinesePunct: true,
          codeBlockPreview: true,
          sanitize: false,
          paragraphBeginningSpace: true,
        },
      },
      typewriterMode: true,
      toolbar: [
        'bold',
        'emoji',
        'italic',
        'strike',
        '|',
        'quote',
        'upload',
        'fullscreen',
        'preview',
      ],
    })
  }

  @Watch('title')
  syncTitle(val: string) {
    this.model.title = val
  }

  @Watch('text')
  syncText(val: string) {
    this.model.text = val
    try {
      this.vditor.setValue(val, true)
    } catch {}
  }

  @Prop({ required: true })
  name!: string

  @Prop({ required: true })
  title!: string

  @Prop({ required: true })
  text!: string

  @Prop({ type: String })
  id!: string | undefined

  model = {
    title: '',
    text: '',
  }
  handleEmitChange() {
    this.$emit('change', this.model)
  }
  handleChangeTitle(e: string) {
    this.model.title = e
    this.handleEmitChange()
  }

  composition = false
  handleFocus() {
    if (!this.composition) {
      this.vditor.focus()
    }
  }
}
</script>
<style lang="scss">
@import '~vditor/src/assets/scss/index.scss';
.vditor-toolbar {
  display: none;
}
</style>
<style lang="scss" scoped>
.middle-content {
  padding: 12px 0;
}
#writer {
  min-height: calc(100vh - 15rem);
}
</style>
