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

    <div
      :class="{
        'grid-half': !(device === 'mobile' || !preview),
        full: !preview,
      }"
    >
      <codemirror
        v-model="model.text"
        :options="cmOptions"
        :events="cmEvents"
        @scroll="handleScroll"
        @change="handleChangeText"
        ref="code"
      />
      <article
        id="markdown-render"
        class="preview"
        v-if="device !== 'mobile' && preview"
        ref="preview"
      >
        <vue-markdown @rendered="update" :source="model.text"> </vue-markdown>
      </article>
    </div>
  </el-form>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import NormInput from '@/components/Input/NormalInput.vue'
import MaterialInput from '../Input/MaterialInput.vue'
import { Prop, Watch } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { codemirror } from 'vue-codemirror'
import { Editor } from 'codemirror'

import { cmOptions } from '@/commom/editor'
import '@/assets/scss/shizuku.scss'
import { ViewportRecord } from '../../store/interfaces/viewport.interface'
import 'codemirror/addon/display/fullscreen'
import 'codemirror/addon/display/fullscreen.css'

import VueMarkdown from 'vue-markdown'
import Prism from 'prismjs'

declare const window: any
@Component({
  components: {
    NormInput,
    MaterialInput,
    codemirror,
    VueMarkdown,
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
  mounted() {
    const Editor: Editor = (this.$refs.code as any)?.codemirror
    document.onkeydown = (e) => {
      if (e.keyCode === 27) {
        e.stopPropagation()
        e.preventDefault()
        Editor.setOption('fullScreen' as any, false)
      }
    }

    setTimeout(() => {
      Editor.setSize(null, null)
      Editor.refresh()
      if (this.fullscreen) {
        this.toggleFullscreen(this.fullscreen)
        return
      }
    }, 2000)
  }
  beforeDestroy() {
    document.onkeydown = null
  }
  @Watch('title')
  syncTitle(val: string) {
    this.model.title = val
  }

  @Watch('text')
  syncText(val: string) {
    this.model.text = val
  }
  cmOptions = cmOptions
  cmEvents = ['scroll', 'viewportChange', 'change']

  update() {
    this.$nextTick(() => {
      Prism.highlightAll()
    })
  }

  @Getter
  viewport!: ViewportRecord
  @Getter
  device!: 'mobile' | 'desktop'

  @Prop({ required: true })
  name!: string

  @Prop({ required: true })
  title!: string

  @Prop({ required: true })
  text!: string

  @Prop({ default: false })
  fullscreen!: boolean

  @Watch('fullscreen')
  toggleFullscreen(val: boolean) {
    const Editor: Editor = (this.$refs.code as any)?.codemirror
    Editor.setOption('fullScreen' as any, val)
  }

  preview = true

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
  handleChangeText() {
    // this.model.text = e.getValue()
    this.handleEmitChange()
  }

  handleScroll(e: Editor) {
    if (this.device !== 'mobile' && this.preview) {
      const viewport = {
        top: e.lineAtHeight(
          (e as any).display.scroller.getBoundingClientRect().top,
        ),
        bottom: e.lineAtHeight(
          (e as any).display.scroller.getBoundingClientRect().bottom,
        ),
      }

      const lineConut = e.lineCount()
      const curPos = viewport.top / lineConut
      const preview = this.$refs.preview as HTMLElement
      const previewHeight = preview.scrollHeight
      preview.scrollTo({
        left: 0,
        top: curPos * previewHeight * 1.2,
      })
    }
  }
  composition = false
  handleFocus() {
    if (!this.composition) {
      ;((this.$refs.code as any).codemirror as Editor).focus()
    }
  }
}
</script>
<style lang="scss" scoped>
.grid-half {
  display: grid;
  position: relative;
  grid-template-columns: 1fr 1fr;
}
.preview {
  height: calc(100vh - 16.7rem);
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
  height: calc(100vh - 15rem);
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

.middle-content {
  margin: 0.8rem 0;
}
</style>
