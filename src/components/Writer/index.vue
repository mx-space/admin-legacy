<template>
  <el-form ref="form" :model="model" label-width="80px">
    <material-input
      :value="model.title"
      :name="name"
      @change="handleChangeTitle"
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
        v-html="md"
        v-if="device !== 'mobile' && preview"
        ref="preview"
      ></article>
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
import MD from 'markdown-it'
import prism from 'markdown-it-prism'
import { cmOptions } from '@/commom/editor'
import '@/assets/scss/shizuku.scss'
import { ViewportRecord } from '../../store/interfaces/viewport.interface'

const md = new MD({
  html: true,
  xhtmlOut: true,
}).use(prism)

@Component({
  components: {
    NormInput,
    MaterialInput,
    codemirror,
  },
  created() {
    const model = {
      title: this.$props.title,
      text: this.$props.text,
    }
    this.$data.model = model
  },
  mounted() {
    // window.cm = this.$refs.code.codemirror
    setTimeout(() => {
      const Editor: Editor = (this.$refs.code as any)?.codemirror
      Editor.setSize(null, null)
      Editor.refresh()
    }, 2000)
  },
})
export default class Writer extends Vue {
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

  get md() {
    return md.render(this.text)
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

.middle-content {
  margin: 0.8rem 0;
}
</style>
