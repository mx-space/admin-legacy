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
      <el-table-column prop="slug" label="路径"> </el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-popconfirm
            title="确定删除吗？"
            @onConfirm="handleDelete(scope.$index)"
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

    <el-dialog title="新分类" :visible.sync="dialogVisible" width="30%">
      <el-form :model="model" label-width="80px" :rules="rules" ref="form">
        <el-form-item label="名字" prop="name">
          <el-input v-model="model.name"></el-input>
        </el-form-item>
        <el-form-item label="路径" prop="slug">
          <el-input v-model="model.slug"></el-input>
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
  </page-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import LayoutButtonVue from '../../../components/Button/LayoutButton.vue'
import PageLayout from '@/layouts/PageLayout.vue'
import pick from 'lodash/pick'
import {
  CategoryType,
  CategoryRespDto,
  CategoriesRespDto,
} from '../../../models/response.dto'
import ParallaxButton from '@/components/Button/ParallaxButton.vue'
import { ElForm } from 'element-ui/types/form'
import { pickNoEmpty } from '../../../utils'
import { Action } from 'vuex-class'
import { CategoryModel } from '../../../store/interfaces/category.interface'

@Component({
  components: {
    LayoutButton: LayoutButtonVue,
    PageLayout,
    ParallaxButton,
  },
})
export default class extends Vue {
  @Action('category/fetchCategory')
  fetchCategory!: Function

  data: CategoryRespDto[] = []
  model: Partial<CategoryModel> = {
    name: '',
    slug: '',
    type: CategoryType.Category,
  }
  options = [
    {
      label: '分类',
      value: CategoryType.Category,
    },
    {
      label: '标签',
      value: CategoryType.Tag,
    },
  ]

  getType(type: 0 | 1) {
    return ['分类', '标签'][type]
  }

  dialogVisible = false

  rules = {
    name: [{ required: true, message: '名称不能为空' }],
    slug: [{ required: true, message: '路径不能为空' }],
  }
  async created() {
    await this.fetch()
  }

  loading = false
  async fetch() {
    this.loading = true
    const resp = (await this.$api('Category').get()) as CategoriesRespDto
    this.data = resp.data
    this.fetchCategory(resp.data)
    this.loading = false
  }
  handleAdd() {
    this.dialogVisible = true
  }
  async handleSubmit() {
    ;(this.$refs.form as ElForm).validate(async (valid) => {
      if (valid) {
        if (this.edit) {
          await this.$api('Category').update(this.edit, pickNoEmpty(this.model))
          this.$message.success('修改成功')
        } else {
          await this.$api('Category').post(pickNoEmpty(this.model))
          this.$message.success('添加成功')
        }
        this.fetch()

        this.dialogVisible = false
        this.model = {
          name: '',
          slug: '',
          type: CategoryType.Category,
        }
      }
    })
  }

  async handleDelete(index: number) {
    const _id = this.data[index]._id
    await this.$api('Category').delete(_id as string)
    this.$notice.success('删除成功')
    this.fetch()
  }

  edit: false | string = false
  handleEdit(row: CategoryRespDto) {
    this.model = pick(row, ['slug', 'name', 'type'])
    this.edit = row._id as string
    this.dialogVisible = true
  }
}
</script>
