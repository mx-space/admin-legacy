<template>
  <el-form ref="form" :model="model" label-width="80px">
    <material-input
      :value="model.title"
      :name="name"
      @change="handleChangeTitle"
    />
    <slot />
    <div
      :class="{
        'grid-half': !(device === 'mobile' || !preview),
        full: !preview,
      }"
    >
      <codemirror
        v-model="model.text"
        :options="cmOption"
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
import { Prop } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { codemirror } from 'vue-codemirror'
import { Editor } from 'codemirror'
import MD from 'markdown-it'
import prism from 'markdown-it-prism'

import 'codemirror/mode/gfm/gfm.js'
import 'codemirror/addon/display/fullscreen.js'
import 'codemirror/theme/3024-day.css'
import 'codemirror/keymap/sublime.js'
import 'codemirror/addon/selection/active-line.js'
// import 'codemirror-typewriter-scrolling/typewriter-scrolling.js'

import 'codemirror/lib/codemirror.css'
import '@/assets/scss/shizuku.scss'
import { ViewportRecord } from '../../store/interfaces/viewport.interface'

const md = new MD({
  html: true,
  xhtmlOut: true,
}).use(prism as any)

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
  cmOption = {
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
    // typewriterScrolling:
    //   !!parseInt(localStorage.getItem(PERFER.typewriter)) || false,
    highlightFormatting: true,
    keymap: 'sublime',
    extraKeys: {
      // strong
      'Cmd-B'(cm: Editor) {
        const doc = cm.getDoc()
        const selection = doc.getSelection()
        if (selection) {
          doc.replaceSelection(`**${selection}**`)
        } else {
          const cursor = doc.getCursor()
          doc.replaceRange('****', cursor)
          cursor.ch += 2
          doc.setCursor(cursor)
        }
      },
      // italic
      'Cmd-I'(cm: Editor) {
        const doc = cm.getDoc()
        const selection = doc.getSelection()
        if (selection) {
          doc.replaceSelection(`*${selection}*`)
        } else {
          const cursor = doc.getCursor()
          doc.replaceRange('**', cursor)
          cursor.ch += 1
          doc.setCursor(cursor)
        }
      },
      // underline
      'Cmd-U'(cm: Editor) {
        const doc = cm.getDoc()
        const selection = doc.getSelection()
        if (selection) {
          doc.replaceSelection(`<u>${selection}</u>`)
        } else {
          const cursor = doc.getCursor()
          doc.replaceRange('<u></u>', cursor)
          cursor.ch += 3
          doc.setCursor(cursor)
        }
      },
      // ref link
      'Cmd-K'(cm: Editor) {
        const doc = cm.getDoc()
        const cursor = doc.getCursor()
        doc.replaceRange('[]()', cursor)
        cursor.ch += 1
        doc.setCursor(cursor)
      },
      // code block
      'Alt-`'(cm: Editor) {
        const doc = cm.getDoc()
        const cursor = doc.getCursor()
        doc.replaceRange('```\n\n```', cursor)
        cursor.ch += 3
        doc.setCursor(cursor)
      },
      // tab to space
      Tab(cm: Editor) {
        const doc = cm.getDoc()
        const cursor = doc.getCursor()
        doc.replaceRange('  ', cursor)
      },
    },
  }
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

  preview = false

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
  handleChangeText(e: Editor) {
    this.model.text = e.getValue()
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
</style>
