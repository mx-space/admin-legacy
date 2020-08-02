<template>
  <Layout>
    <h4>从 MarkDown 导入数据</h4>
    <el-form label-width="80px">
      <el-form-item label="导入到: ">
        <el-select v-model="importTo">
          <el-option
            v-for="item in types"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="准备就绪..">
        <el-upload
          action=""
          multiple
          :on-change="handleChange"
          :auto-upload="false"
          :file-list="fileList"
        >
          <el-button size="small" type="primary">导入</el-button>
          <el-button type="success" size="small" @click="handleParse">
            开始转换
          </el-button>
          <el-button type="primary" size="small" @click="handleUpload">
            点击上传
          </el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传markdown文件
          </div>
        </el-upload>
      </el-form-item>
    </el-form>
  </Layout>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import PageLayout from '@/layouts/PageLayout.vue'

import { ParseMarkdownYAML, ParsedModel } from '@/utils/markdown'
import rest from '../../api/rest'

enum ImportType {
  Post,
  Note,
}

@Component({
  components: { Layout: PageLayout },
})
export default class ImportView extends Vue {
  importTo = ImportType.Post
  parsedList = [] as ParsedModel[]
  types = [
    {
      value: ImportType.Post,
      label: '博文',
    },
    {
      label: '日记',
      value: ImportType.Note,
    },
  ]

  fileList: File[] = []
  handleChange(file, fileList: File[]) {
    this.fileList = fileList
  }
  async handleParse(e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!this.fileList.length) {
      return
    }
    const strList = [] as string[]
    for await (const _file of this.fileList) {
      const res = await Promise.resolve(
        new Promise((resolve, reject) => {
          const file = (_file as any).raw as File | null
          if (!file) {
            return reject('File is empty')
          }
          if (file.type !== 'text/markdown') {
            this.$message.error('只能转换 markdown 文件')
            return reject('File must be markdown.')
          }
          const reader = new FileReader()
          reader.onload = (e) => {
            // console.log(e.target?.result)
            resolve((e.target?.result as string) || '')
          }
          reader.readAsText(file)
        }),
      )
      strList.push(res as string)
    }
    const parsedList = this.parseMarkdown(strList)
    console.log(parsedList)
    this.parsedList = parsedList
  }
  parseMarkdown(strList: string[]) {
    const parser = new ParseMarkdownYAML(strList)
    return parser.start().map((i, index) => {
      i.meta!.slug = (this.fileList[index] as any).raw.name.replace(/\.md$/, '')
      return i
    })
  }

  async handleUpload(e: MouseEvent) {
    e.stopPropagation()
    e.preventDefault()
    if (!this.parsedList.length) {
      return this.$message.error('请先解析!!')
    }
    await rest.post('helper/markdown/import', {
      type: this.importTo,
      data: this.parsedList,
    })
    this.$message.success('上传成功!')
    this.fileList = []
  }
}
</script>
