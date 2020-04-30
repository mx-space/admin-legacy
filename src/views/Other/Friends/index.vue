<template>
  <page-layout>
    <template #header>
      <layout-button
        @click.native="handleAdd"
        :icon="['fas', 'plus']"
        name="新增"
    /></template>
    <el-table
      :data="data"
      style="width: 100%;"
      max-height="650"
      stripe
      v-loading="loading"
    >
      <el-table-column prop="name" label="名称"> </el-table-column>
      <el-table-column label="网址">
        <template slot-scope="scope">
          <a :href="scope.row.url" nofollow>
            {{ scope.row.url }}
          </a>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-popconfirm
            title="确定删除吗？"
            @onConfirm="handleDelete(scope.$index)"
          >
            <el-button type="text" size="small" slot="reference">
              移除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="新朋友" :visible.sync="dialogVisible" width="30%">
      <el-form :model="model" label-width="80px" :rules="rules" ref="form">
        <el-form-item label="名字" prop="name">
          <el-input v-model="model.name"></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <el-input v-model="model.avatar"></el-input>
        </el-form-item>
        <el-form-item label="网址" prop="url">
          <el-input v-model="model.url"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <ParallaxButton
          @click="dialogVisible = false"
          title="取消"
          type="warning"
        />
        <ParallaxButton title="提交" @click="handleSubmit" />
      </span>
    </el-dialog>

    <template #end>
      <el-pagination
        hide-on-single-page
        layout="prev, pager, next"
        :total="page.total"
        @prev-click="handleTo(page.currentPage - 1)"
        @next-click="handleTo(page.currentPage + 1)"
        @current-change="handleTo"
        class="el-pager"
      />
    </template>
  </page-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import LayoutButtonVue from '../../../components/Button/LayoutButton.vue'
import PageLayout from '@/layouts/PageLayout.vue'
import { LinkModel, LinkRespDto, PagerDto } from '../../../models/response.dto'
import { MessageBox } from 'element-ui'
import ParallaxButton from '@/components/Button/ParallaxButton.vue'
import { ElForm } from 'element-ui/types/form'
// @ts-ignore
import isURL from 'validator/lib/isURL'

const checkUrl = (rule: string, val: string, cb: Function) => {
  if (!val) {
    return cb(new Error('网站不能为空啦'))
  }
  if (!isURL(val, { require_protocol: true })) {
    return cb(new Error('必须为网址哦'))
  }
  cb()
}

@Component({
  components: {
    LayoutButton: LayoutButtonVue,
    PageLayout,
    ParallaxButton,
  },
})
export default class extends Vue {
  data: LinkModel[] = []
  model: LinkModel = { name: '', url: '', avatar: '' }
  dialogVisible = false
  page: PagerDto = {} as PagerDto
  rules = {
    name: [{ required: true, message: '名字不能为空' }],
    url: [
      { required: true, message: '网站不能为空啦' },
      { validator: checkUrl, trigger: 'blur' },
    ],
  }
  async created() {
    await this.fetch()
  }
  loading = false
  async fetch({ page = 1, size = 10 } = {}) {
    this.loading = true
    const resp = (await this.$api('Link').gets({
      page,
      size,
    })) as LinkRespDto
    this.data = resp.data
    this.page = resp.page
    this.loading = false
  }
  handleAdd() {
    this.dialogVisible = true
  }
  async handleSubmit() {
    ;(this.$refs.form as ElForm).validate(async (valid) => {
      if (valid) {
        await this.$api('Link').post(this.model)
        this.$message.success('添加成功')
        this.fetch()
        this.dialogVisible = false
        this.model = { name: '', url: '', avatar: '' }
      }
    })
  }

  async handleDelete(index: number) {
    const _id = this.data[index]._id
    await this.$api('Link').delete(_id as string)
    this.$notice.success('删除成功')
    this.fetch()
  }

  handleTo(page: number) {
    this.fetch({ page })
  }
}
</script>
