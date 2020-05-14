<template>
  <page-layout>
    <template #header>
      <layout-button
        :icon="['far', 'trash-alt']"
        backcolor="#e67e22"
        @click.native="handleDeleteMore"
        name="批量删除"
      ></layout-button>
    </template>
    <el-table
      :data="data"
      style="width: 100%;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="filename" label="备份日期" width="120px">
      </el-table-column>
      <el-table-column prop="size" label="大小"> </el-table-column>
      <el-table-column fixed="right" label="操作" width="100px">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="handleDownload(scope.row)"
          >
            下载
          </el-button>
          <el-popconfirm
            title="确定删除吗?"
            @onConfirm="handleDelete(scope.row)"
          >
            <el-button
              type="text"
              size="small"
              slot="reference"
              style="color: #e74c3c;"
            >
              移除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </page-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import LayoutButton from '@/components/Button/LayoutButton.vue'
import PageLayout from '@/layouts/PageLayout.vue'
import axios from 'axios'
import $axios from '../../api/rest'
@Component({
  components: {
    LayoutButton,
    PageLayout,
  },
})
export default class BackupView extends Vue {
  data: any[] = []
  async created() {
    await this.fetch()
  }
  async fetch() {
    const { data } = (await this.$api('Backup').get()) as any
    this.data = [...data]
  }
  async handleDelete(row) {
    await this.deleteMore([row])
  }
  async deleteMore(rows: any[]) {
    const files = [] as string[]
    for await (const row of rows) {
      files.push(row.filename as string)
    }
    await this.$api('Backup').del(undefined, {
      params: {
        files: files.join(','),
      },
    })
    await this.fetch()
    this.$message.success('删除成功')
  }
  handleDeleteMore() {
    this.deleteMore(this.multipleSelection)
  }
  handleDownload(row) {
    this.$api('Backup')
      .get(row.filename, {
        responseType: 'blob',
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response as any]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', row.filename + '.zip')
        document.body.appendChild(link)
        link.click()
      })
  }
  multipleSelection = []
  handleSelectionChange(val) {
    this.multipleSelection = val
  }
}
</script>
