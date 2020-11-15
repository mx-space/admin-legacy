<template>
  <page-layout>
    <template #header>
      <layout-button
        @click.native="handleAdd"
        :icon="['fas', 'plus']"
        name="新增"
    /></template>
    <h4>分类</h4>
    <el-table
      :data="data"
      style="width: 100%"
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
              style="color: red"
            >
              移除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <h4>标签</h4>
    <el-badge
      v-for="tag in tags"
      :key="tag.name"
      :value="tag.count"
      class="tag"
    >
      <el-tag @click="handleFetchArticleWithTag(tag.name)">{{
        tag.name
      }}</el-tag>
    </el-badge>

    <el-table
      :data="posts"
      style="width: 100%"
      max-height="650"
      v-loading="posts === null"
      v-if="!posts || posts.length > 0"
    >
      <el-table-column prop="title" label="标题">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="
              $router.push('/posts/edit?id=' + scope.row._id)
            "
            type="text"
            size="small"
          >
            {{ scope.row.title }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="分类">
        <template slot-scope="scope">
          <span>{{ scope.row.category.name }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="新分类" :visible.sync="dialogVisible" width="360px">
      <el-form :model="model" label-width="80px" :rules="rules" ref="form">
        <el-form-item label="名字" prop="name">
          <el-input v-model="model.name"></el-input>
        </el-form-item>
        <el-form-item label="路径" prop="slug">
          <el-input v-model="model.slug"></el-input>
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
  PostRespDto,
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

  dialogVisible = false

  rules = {
    name: [{ required: true, message: '名称不能为空' }],
    slug: [{ required: true, message: '路径不能为空' }],
  }
  async created() {
    await this.fetch()
  }

  loading = false

  tags: { name: string; count: number }[] = []
  async fetch() {
    this.loading = true
    const catedata = (await this.$api('Category').get()) as CategoriesRespDto
    this.data = catedata.data
    this.fetchCategory(catedata.data)
    this.loading = false

    const tagdata = (await this.$api('Category').get(undefined, {
      params: {
        type: 'Tag',
      },
    })) as { data: { name: string; count: number }[] }

    this.tags = [...tagdata.data]
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

  posts: PostRespDto[] | null = []
  curTag: null | string = null
  async handleFetchArticleWithTag(tag: string) {
    this.curTag = tag
    this.posts = null
    const { data: posts } = (await this.$api('Category').get(tag, {
      params: {
        tag: 'true',
      },
    })) as any
    this.posts = posts
  }
}
</script>

<style lang="scss" scoped>
.tag {
  margin-right: 1rem;
  cursor: pointer;
  user-select: none;
}
</style>
