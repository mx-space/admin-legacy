<template>
  <page-layout>
    <template #header>
      <layout-button
        @click.native="handleAdd"
        :icon="['fas', 'plus']"
        name="新增"
    /></template>
    <el-tabs v-model="tabActive" @tab-click="handleTabClick">
      <el-tab-pane label="朋友们" name="0"></el-tab-pane>
      <el-tab-pane label="待审核" name="1"></el-tab-pane>
    </el-tabs>
    <el-table
      :data="data"
      style="width: 100%;"
      max-height="650"
      stripe
      v-loading="loading"
    >
      <el-table-column prop="name" label="名称"> </el-table-column>
      <el-table-column prop="type" label="类型">
        <template slot-scope="scope">
          {{ getType(scope.row.type || 0) }}
        </template>
      </el-table-column>
      <el-table-column label="网址">
        <template slot-scope="scope">
          <a :href="scope.row.url" nofollow>
            {{ scope.row.url }}
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述"> </el-table-column>
      <el-table-column
        label="操作"
        :width="tabActive === '1' ? 160 : 130"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="handleApprove(scope.row._id)"
            style="color: green;"
            v-if="tabActive === '1'"
            >通过</el-button
          >
          <el-button type="text" size="small" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-popconfirm
            title="确定删除吗？"
            @onConfirm="handleDelete(scope.$index)"
            style="padding: 9px 15px;"
          >
            <el-button
              type="text"
              size="small"
              slot="reference"
              style="color: red;"
            >
              移除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="edit ? '编辑' : '新朋友'"
      :visible.sync="dialogVisible"
      :width="viewport.mobile ? '360px' : '500px'"
    >
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
        <el-form-item label="描述" prop="description">
          <el-input v-model="model.description"></el-input>
        </el-form-item>

        <el-form-item label="类型" prop="type">
          <el-select v-model="model.type" placeholder="">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <ParallaxButton
          @click="
            dialogVisible = false
            edit = false
          "
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
        :page-size="50"
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
import pick from 'lodash/pick'
import {
  LinkModel,
  LinkRespDto,
  PagerDto,
  LinkType,
} from '../../../models/response.dto'
import ParallaxButton from '@/components/Button/ParallaxButton.vue'
import { ElForm } from 'element-ui/types/form'
// @ts-ignore
import isURL from 'validator/lib/isURL'
import { emptyString2Undefined } from '../../../utils'
import { Getter } from 'vuex-class'
import { ViewportRecord } from '../../../store/interfaces/viewport.interface'

const checkUrl = (rule: string, val: string, cb: any) => {
  if (!val) {
    return cb(new Error('网站不能为空啦'))
  }
  if (!isURL(val, { require_protocol: true })) {
    return cb(new Error('必须为网址哦'))
  }
  cb()
}
enum LinkState {
  Pass,
  Audit,
}
@Component({
  components: {
    LayoutButton: LayoutButtonVue,
    PageLayout,
    ParallaxButton,
  },
})
export default class extends Vue {
  @Getter('viewport')
  viewport!: ViewportRecord
  handleTabClick() {
    this.fetch()
  }
  tabActive = String(LinkState.Pass)
  data: LinkModel[] = []
  model: LinkModel = {
    name: '',
    url: '',
    avatar: '',
    description: '',
    type: LinkType.Friend,
  }
  options = [
    {
      label: '朋友',
      value: LinkType.Friend,
    },
    {
      label: '收藏',
      value: LinkType.Collection,
    },
  ]

  getType(type: 0 | 1) {
    return ['朋友', '收藏'][type]
  }

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
  async fetch(page = 1) {
    this.loading = true
    const resp = (await this.$api('Link').gets({
      page,
      size: 50,
      state: parseInt(this.tabActive),
    })) as LinkRespDto
    this.data = resp.data
    this.page = resp.page
    this.loading = false
  }
  handleAdd() {
    this.dialogVisible = true
    this.edit = false
    this.reset()
  }
  reset() {
    this.model = {
      name: '',
      url: '',
      avatar: '',
      type: LinkType.Friend,
      description: '',
    }
  }
  async handleSubmit() {
    ;(this.$refs.form as ElForm).validate(async (valid) => {
      if (valid) {
        if (this.edit) {
          await this.$api('Link').update(
            this.edit,
            emptyString2Undefined(this.model),
          )
          this.$message.success('修改成功')
        } else {
          await this.$api('Link').post(emptyString2Undefined(this.model))
          this.$message.success('添加成功')
        }
        this.fetch()
        this.dialogVisible = false
        this.reset()
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
    this.fetch(page)
  }

  edit: false | string = false
  handleEdit(row: LinkModel) {
    this.model = pick(row, ['name', 'url', 'avatar', 'description', 'type'])
    this.edit = row._id as string
    this.dialogVisible = true
  }

  handleApprove(id: string) {
    this.$api('Link', 'audit')
      .patch({ id })
      .then(() => {
        this.fetch()
      })
  }
}
</script>
