<template>
  <page-layout>
    <template #header>
      <Button
        name="上传"
        :icon="['fas', 'upload']"
        @click.native="uploadWeightShow = true"
      />
    </template>
    <el-table :data="data" style="width: 100%" :default-sort="order">
      <el-table-column
        prop="filename"
        label="文件名"
        width="240px"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column prop="type" label="类型" sortable width="80px">
        <template slot-scope="scope">
          {{ type2Name(scope.row.type) }}
        </template>
      </el-table-column>
      <el-table-column label="位于" prop="locate" sortable width="80px">
        <template slot-scope="scope">
          {{ scope.row.locate ? '在线' : '本地' }}
        </template>
      </el-table-column>
      <el-table-column
        header-align="left"
        align="left"
        prop="created"
        label="上传于"
        sortable
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.created ? parseDate(scope.row.created, 'LLLL') : '' }}
        </template>
      </el-table-column>
      <el-table-column
        header-align="left"
        align="left"
        prop="url"
        label="预览"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-popover placement="right" width="400" trigger="hover">
            <img
              :src="getPreviewUrl(scope.$index)"
              :style="{
                width: '100%',
              }"
            />
            <a :href="getPreviewUrl(scope.$index)" slot="reference">{{
              getPreviewUrl(scope.$index)
            }}</a>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-popconfirm
            title="确定删除吗？"
            @onConfirm="handleDelete(scope.row.id)"
          >
            <el-button
              type="text"
              size="small"
              slot="reference"
              style="color: red"
            >
              移除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="上传图片" :visible.sync="uploadWeightShow" width="360px">
      <el-select
        v-model="uploadType"
        :style="{
          marginBottom: '2rem',
        }"
      >
        <el-option
          v-for="item in types"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>

      <el-upload
        class="avatar-uploader"
        :action="uploadUrl"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        list-type="picture"
        :auto-upload="false"
        ref="upload"
        :on-change="handleOnChange"
        :file-list="fileList"
        :headers="headers"
        :on-preview="handlePreview"
      >
        <div slot="tip" class="el-upload__tip">只能上传图片，且不超过5MB</div>

        <el-button slot="trigger" size="small" type="primary"
          >选取文件</el-button
        >
        <el-button
          style="margin-left: 10px"
          size="small"
          type="success"
          @click="submitUpload"
          >上传到服务器</el-button
        >
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadWeightShow = false">取 消</el-button>
        <el-button type="primary" @click="uploadWeightShow = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </page-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import PageLayout from '@/layouts/PageLayout.vue'
import { File, FileType, FileLocate } from '../../../models'
import { getFileType } from '@/utils/file'
import LayoutButton from '@/components/Button/LayoutButton.vue'
import { ElUpload } from 'element-ui/types/upload'
import { getToken } from '../../../utils/auth'
import { parseDate } from '@/utils/time'
import { urlResolve } from '../../../utils'
@Component({
  components: { PageLayout, Button: LayoutButton },
})
export default class FilesView extends Vue {
  data: File[] = []
  fileList = []
  uploadWeightShow = false
  uploadType = FileType.IMAGE
  types = [
    {
      label: '图片',
      value: FileType.IMAGE,
    },
    {
      value: FileType.AVATAR,
      label: '头像',
    },
    {
      value: FileType.BACKGROUND,
      label: '背景',
    },
    {
      value: FileType.PHOTO,
      label: '相片',
    },
  ]
  created() {
    this.fetch()
  }
  async fetch() {
    const { data } = await this.$api('Upload').get()
    this.data = data
  }
  get type2Name() {
    return getFileType
  }
  order = {
    prop: 'type',
    order: 'ascending',
  }
  getPreviewUrl(index: number) {
    const row = this.data[index]

    return row.locate === FileLocate.Online
      ? row.url
      : urlResolve(
          process.env.VUE_APP_BASE_API,
          'uploads',
          getImageType(row.type),
          row.name,
        )
  }
  async handleDelete(id: string) {
    await this.$api('Upload').del(id)
    this.$message.success('删除成功')
    this.fetch()
  }
  get uploadUrl() {
    return urlResolve(
      process.env.VUE_APP_BASE_API,
      'uploads',
      'image?type=' + this.uploadType,
    )
  }
  handleAvatarSuccess(...rest) {
    console.log(rest)
  }
  submitUpload() {
    ;(this.$refs.upload as ElUpload).submit()
  }
  handleRemove(file, fileList) {
    console.log(file, fileList)
  }
  handlePreview(file) {
    console.log(file)
  }
  get headers() {
    return {
      Authorization: 'bearer ' + getToken(),
    }
  }
  get parseDate() {
    return parseDate
  }
  handleOnChange(file, fileList) {
    this.fileList = fileList
  }
}
function getImageType(type: FileType) {
  const ft = Object.keys(FileType)
  return ft.splice(ft.length / 2)[type].toLowerCase()
}
</script>
