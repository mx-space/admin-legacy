<template>
  <PageLayout>
    <template #header>
      <Button
        name="撰写"
        :icon="['fas', 'plus']"
        @click.native="$router.push({ name: 'edit-posts' })"
      />
    </template>
    <el-table
      :data="data"
      style="width: 100%"
      max-height="650"
      stripe
      v-loading="loading"
      @sort-change="handleSort"
      @filter-change="filterHandler"
    >
      <el-table-column prop="title" label="标题" sortable="custom">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="
              $router.push('/posts/edit?id=' + data[scope.$index]._id)
            "
            type="text"
            size="small"
          >
            {{ data[scope.$index].title }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="category"
        label="分类"
        sortable="custom"
        width="200"
        :filters="categoryFilters"
        column-key="category"
      >
        <template slot-scope="scope">
          {{
            categories &&
            categories.get(data[scope.$index].categoryId) &&
            categories.get(data[scope.$index].categoryId).name
          }}
        </template>
      </el-table-column>

      <el-table-column
        prop="created"
        label="创建时间"
        width="150"
        sortable="custom"
      >
        <template slot-scope="scope">
          {{ relativeTimeFromNow(data[scope.$index].created) }}
        </template>
      </el-table-column>

      <el-table-column
        prop="modified"
        label="修改于"
        width="150"
        sortable="custom"
      >
        <template slot-scope="scope">
          {{ parseDate(data[scope.$index].modified) }}
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="100">
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
    <template #end>
      <el-pagination
        hide-on-single-page
        layout="prev, pager, next"
        :total="page.total"
        @prev-click="handleTo(page.currentPage - 1)"
        @next-click="handleTo(page.currentPage + 1)"
        @current-change="handleTo"
        class="el-pager"
        v-if="!isFilter"
      />
    </template>
  </PageLayout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout.vue'
import { mapGetters } from 'vuex'
import Button from '@/components/Button/LayoutButton'
import { omit } from 'lodash'
import * as time from '@/utils/time'
import { CategoryModel } from '../../store/interfaces/category.interface'
export default {
  components: {
    PageLayout,
    Button,
  },
  data() {
    return {
      page: {},
      data: [],
      raw: [],
      loading: true,
      isFilter: false,
      sortBy: '',
      sortOrder: 0,
    }
  },
  async created() {
    await this.getData()
  },
  computed: {
    ...mapGetters(['categories']),
    categoryFilters() {
      return [...this.categories.entries()].map(([id, val]) => {
        return { text: val.name, value: id }
      })
    },
  },
  methods: {
    getCategoryName(id) {
      return this.categories.get(id)?.name
    },
    async handleDelete(index) {
      const _id = this.data[index]._id
      await this.$api('Post').delete(_id)
      this.$notice.success('删除成功')
      this.getData()
    },
    handleEdit(row) {
      this.$router.push({
        name: 'edit-posts',
        query: {
          id: row._id,
        },
      })
    },
    async handleTo(page) {
      await this.getData({ page })
    },
    relativeTimeFromNow(val) {
      return time.relativeTimeFromNow(val)
    },
    parseDate(val) {
      return time.parseDate(val, 'YYYY年M月D日')
    },
    async getData(ops = {}) {
      this.loading = true
      const { page, data } = await this.$api('Post').gets(
        {
          page: ops.page || this.page?.currentPage || 1,
          size: ops.size || 10,
        },
        this.sortBy ? { sortBy: this.sortBy, sortOrder: this.sortOrder } : {},
      )
      this.page = page
      this.data = data
      this.raw = [...data]
      this.loading = false
    },
    async filterHandler(filters) {
      const categories = filters['category']
      if (!categories.length) {
        this.data = [...this.raw]
        this.isFilter = false
        return
      }
      const serialization = categories.join(',')
      let { data } = await this.$api('Category').get(undefined, {
        params: { ids: serialization },
      })
      data = data
        .map((c) => {
          return c.category.children.map((ch) => ({
            ...ch,
            categoryId: c.category._id,
            ...omit(c.category, 'children'),
          }))
        })
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
        .flat()
      // console.log(data)
      this.data = data
      this.isFilter = true
    },
    async handleSort({ prop, order }) {
      this.sortOrder = order ? { descending: -1, ascending: 1 }[order] : 0

      this.sortBy = !this.sortOrder ? '' : prop
      await this.getData()
    },
  },
}
</script>

<style lang="scss" scoped>
$basic-color: #1188e8;
$common-color: #1187e8c2;
$highlight: #ffcca8;
.action_btn {
  margin-right: 1ch;
  cursor: pointer;
  user-select: none;
  &.primary {
    color: $basic-color;
    transition: color 0.25s;
    &:hover {
      color: $highlight;
    }
  }
  &.danger {
    color: #e74c3c;
  }
}
.el-pager {
  display: inline-block;
}
</style>
