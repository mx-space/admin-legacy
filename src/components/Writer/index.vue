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

    <codemirror
      class="editor"
      ref="editor"
      :value="model.text"
      :options="cmOptions"
      @input="handleChangeText"
    />
  </el-form>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import NormInput from '@/components/Input/NormalInput.vue'
import MaterialInput from '../Input/MaterialInput.vue'
import { Prop, Watch } from 'vue-property-decorator'
import { codemirror } from 'vue-codemirror'
import { EditorConfiguration, Editor } from 'codemirror'

// import base style
import 'codemirror/lib/codemirror.css'
import 'codemirror/keymap/sublime'
import 'codemirror/mode/gfm/gfm'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/go/go'
import 'codemirror/mode/htmlembedded/htmlembedded'
import 'codemirror/mode/css/css'
import 'codemirror/mode/sass/sass'
import 'codemirror/mode/swift/swift'

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
    codemirror,
  },
})
export default class Writer extends Vue {
  created() {
    const model = {
      title: this.$props.title,
      text: this.$props.text,
    }
    this.model = model
  }
  cmOptions: EditorConfiguration = {
    mode: 'gfm',
    keyMap: 'sublime',
    lineNumbers: true,
    tabSize: 2,
    autocapitalize: false,
    autocorrect: true,
    lineWrapping: true,
    foldGutter: true,
  }
  beforeDestroy() {
    this.$events.$off('writer-submit')
  }
  mounted() {
    // @ts-ignore
    this.$events.$on('writer-submit', () => {
      console.log('clear cache.')
    })
    const cachedKey = 'mx-space-writer' + (this.id ? `-${this.id}` : '')
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
  handleChangeTitle(e: string) {
    this.model.title = e
    this.handleEmitChange()
  }
  handleChangeText(e: string) {
    this.model.text = e
    this.handleEmitChange()
  }
  composition = false
  handleFocus() {
    if (!this.composition) {
      ;((this.$refs.editor as any) as Editor).focus()
    }
  }
}
</script>
<style lang="scss">
.CodeMirror {
  border: 1px solid #eee;
  /* height: auto; */
  font-family: inherit;
  height: calc(100vh - 15rem);
  .CodeMirror-code {
    font-family: 'Operator Mono', monospace;
    .CodeMirror-linenumber {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
        Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
  }
}
</style>
<style lang="scss" scoped>
.middle-content {
  padding: 12px 0;
}
</style>
