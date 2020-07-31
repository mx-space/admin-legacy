<template>
  <page-layout>
    <template #header>
      <layout-button
        :icon="['fas', 'undo-alt']"
        backcolor="#2ecc71"
        @click.native="handleBackup"
        name="立即备份"
      ></layout-button>

      <layout-button
        :icon="['fas', 'redo-alt']"
        backcolor="#2980b9"
        @click.native="handleRestore"
        name="上传恢复"
      ></layout-button>

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
      <el-table-column prop="filename" label="备份日期" width="160px">
        <template slot-scope="scope">
          {{ scope.row.filename }}
        </template>
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
            :title="`确定回退到 ${scope.row.filename} 吗?`"
            @onConfirm="handleRollback(scope.row)"
          >
            <el-button
              type="text"
              size="small"
              slot="reference"
              style="color: #f77c38;"
            >
              回退
            </el-button>
          </el-popconfirm>

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
import client from '../../socket'

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
  async handleRollback(row) {
    const { filename } = row
    await this.$api('Backup').api(filename, {
      method: 'patch',
      params: {
        sid: client.socket.id,
      },
    })
  }
  responseBlobToFile(response: any, filename: string) {
    const url = window.URL.createObjectURL(new Blob([response as any]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
  }
  handleDownload(row) {
    this.$api('Backup')
      .get(row.filename, {
        responseType: 'blob',
        timeout: Infinity,
      })
      .then((response) => {
        this.responseBlobToFile(response, row.filename + '.zip')
      })
  }
  multipleSelection = []
  handleSelectionChange(val) {
    this.multipleSelection = val
  }
  handleBackup() {
    this.$api('Backup')
      .get('new', { timeout: Infinity, responseType: 'blob' })
      .then((res) => {
        this.responseBlobToFile(res, 'Backup.zip')
      })
  }
  handleRestore() {
    const $file = document.createElement('input')
    $file.type = 'file'
    $file.style.cssText = `position: absolute; opacity: 0; z-index: -9999;top: 0; left: 0`
    $file.accept = '.zip'
    document.body.append($file)
    $file.click()
    $file.onchange = () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const [file] = $file.files!
      const formData = new FormData()
      formData.append('file', file)
      this.$api('Backup')
        .post(formData, {
          timeout: Infinity,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(() => {
          this.$message.success('回复成功')
          location.reload()
        })
    }
  }
}
</script>
