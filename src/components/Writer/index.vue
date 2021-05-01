<!--
 * @Author: Innei
 * @Date: 2020-05-17 16:16:26
 * @LastEditTime: 2020-08-07 11:10:21
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

    <!-- <codemirror
      class="editor"
      ref="editor"
      :value="model.text"
      :options="cmOptions"
      @input="handleChangeText"
    /> -->
    <div class="editor" ref="editor_wrapper"></div>
  </el-form>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import NormInput from '@/components/Input/NormalInput.vue'
import MaterialInput from '../Input/MaterialInput.vue'
import { Prop, Watch } from 'vue-property-decorator'

import { editor as Editor, KeyMod, KeyCode, Selection } from 'monaco-editor'

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

@Component({
  components: {
    NormInput,
    MaterialInput,
  },
})
export default class Writer extends Vue {
  $editor?: Editor.IStandaloneCodeEditor

  handler = (e) => {
    // console.log(this.isEdited)

    // if (this.isEdited) {
    const res = confirm('文章未保存是否后退')
    if (!res) {
      this.pushState()
    } else {
      history.back()
      window.removeEventListener('popstate', this.handler)
    }
    // }
  }
  created() {
    const model = {
      title: this.$props.title,
      text: this.$props.text,
    }
    this.model = model
    this.pushState()

    window.addEventListener('popstate', this.handler)
  }

  $refs!: {
    editor_wrapper: HTMLDivElement
  }

  beforeDestroy() {
    this.$events.$off('writer-submit')
    window.removeEventListener('popstate', this.handler)
  }

  // @Watch('isEdited')
  pushState() {
    history.pushState(null, window.location.href)
  }

  mounted() {
    this.initEditor()

    // @ts-ignore
    // this.$events.$on('writer-submit', () => {
    //   console.log('clear cache.')
    // })
    // TODO cache
    // const cachedKey = 'mx-space-writer' + (this.id ? `-${this.id}` : '')
  }
  // isEdited = false
  initEditor() {
    const editor = Editor.create(this.$refs.editor_wrapper, {
      value: this.model.text,
      language: 'markdown',
      automaticLayout: true,
      wrappingStrategy: 'advanced',
      minimap: { enabled: false },
      wordWrap: 'on',
      cursorStyle: 'line-thin',
      formatOnType: true,
    })

    // editor.onKeyUp(() => {
    //   if (!this.isEdited) {
    //     this.isEdited = true
    //   }
    // })
    ;['onKeyDown', 'onDidPaste', 'onDidBlurEditorText'].forEach((eventName) => {
      // @ts-ignore
      editor[eventName](() => {
        this.handleChangeText(editor.getValue())
      })
    })

    editor.addAction({
      id: 'bold',
      label: 'bold',
      keybindings: [KeyMod.CtrlCmd | KeyCode.KEY_B],
      // @ts-ignore
      run: (e) => {
        this.registerRule('**')

        return null
      },
    })

    editor.addAction({
      id: 'em',
      label: 'em',
      keybindings: [KeyMod.CtrlCmd | KeyCode.KEY_I],
      // @ts-ignore
      run: (e) => {
        this.registerRule('*')

        return null
      },
    })

    editor.addAction({
      id: 'null',
      label: 'null',
      keybindings: [
        KeyMod.CtrlCmd | KeyCode.KEY_S,
        KeyMod.Shift | KeyMod.Alt | KeyCode.KEY_F,
      ],
      // @ts-ignore
      run: (e) => {
        return null
      },
    })

    editor.addAction({
      id: 'del',
      label: 'del',
      keybindings: [KeyMod.Alt | KeyCode.KEY_D],
      // @ts-ignore
      run: (e) => {
        this.registerRule('~~')

        return null
      },
    })

    // eslint-disable-next-line no-sparse-arrays
    const keycodeMap: number[] = [
      ,
      KeyCode.KEY_1,
      KeyCode.KEY_2,
      KeyCode.KEY_3,
      KeyCode.KEY_4,
      KeyCode.KEY_5,
    ] as any
    Array.from({ length: 5 })
      .fill(null)
      .forEach((_, _i) => {
        const i = _i + 1
        editor.addAction({
          id: 'head-' + i,
          label: 'heading',
          keybindings: [KeyMod.CtrlCmd | keycodeMap[i]],
          // @ts-ignore
          run: (e) => {
            const selection = e.getSelection()
            if (!selection) {
              return null
            }
            const L = selection.startLineNumber
            const prefixRange = {
              startLineNumber: L,
              endLineNumber: L,
              startColumn: 0,
              endColumn: i + 2,
            }
            const prefix = e.getModel()?.getValueInRange(prefixRange)

            if (prefix && prefix == '#'.repeat(i) + ' ') {
              e.executeEdits('', [{ range: prefixRange, text: '' }])
              return
            }

            e.executeEdits('', [
              {
                range: {
                  startLineNumber: L,
                  endLineNumber: L,
                  startColumn: 0,
                  endColumn: 0,
                },
                text: `${'#'.repeat(i)} `,
              },
            ])
          },
        })
      })

    this.$editor = editor
  }

  @Watch('title')
  syncTitle(val: string) {
    if (this.model.title !== val) {
      this.model.title = val
    }
  }

  @Watch('text')
  syncText(val: string) {
    if (this.model.text !== val) {
      this.model.text = val
      this.$editor?.setValue(val)
    }
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
  handleChangeTitle(title: string) {
    this.model.title = title
    this.handleEmitChange()
  }
  handleChangeText(text: string) {
    this.model.text = text
    this.handleEmitChange()
  }
  composition = false
  handleFocus() {
    if (!this.composition) {
      this.$editor?.focus()
    }
  }

  registerRule(symbol: string) {
    const e = this.$editor
    if (!e) {
      return
    }

    const len = symbol.length

    const selection = e.getSelection()

    if (!selection) {
      return
    }
    if (
      selection.startLineNumber == selection.endLineNumber &&
      selection.startColumn == selection.endColumn
    ) {
      e.executeEdits('', [{ range: selection, text: symbol.repeat(2) }])

      const newSelection = new Selection(
        selection.startLineNumber,
        selection.startColumn + len,
        selection.startLineNumber,
        selection.startColumn + len,
      )
      e.setSelection(newSelection)
    } else {
      const rangeText = e.getModel()?.getValueInRange(selection)
      if (!rangeText) {
        return
      }
      if (rangeText.startsWith(symbol) && rangeText.endsWith(symbol)) {
        // if already apply rule, cancel it
        e.executeEdits('', [
          {
            range: selection,
            text: `${rangeText.slice(len, rangeText.length - len)}`,
          },
        ])
        return
      }
      e.executeEdits('', [
        { range: selection, text: `${symbol}${rangeText}${symbol}` },
      ])
    }

    return
  }
}
</script>

<style lang="scss" scoped>
.middle-content {
  padding: 12px 0;
}
.editor {
  height: calc(100vh - 15rem);
  position: relative;
  overflow: hidden;
}
</style>
