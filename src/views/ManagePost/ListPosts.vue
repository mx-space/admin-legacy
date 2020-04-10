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
      style="width: 100%;"
      max-height="650"
      stripe
      v-loading="loading"
      border
    >
      <el-table-column prop="title" label="标题">
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
      <el-table-column prop="title" label="分类" width="200">
        <template slot-scope="scope">
          {{
            categories &&
            categories.get(data[scope.$index].categoryId) &&
            categories.get(data[scope.$index].categoryId).name
          }}
        </template>
      </el-table-column>

      <el-table-column prop="created" label="创建时间" width="150">
        <template slot-scope="scope">
          {{ relativeTimeFromNow(data[scope.$index].created) }}
        </template>
      </el-table-column>

      <el-table-column prop="modified" label="修改于" width="150">
        <template slot-scope="scope">
          {{ parseDate(data[scope.$index].modified) }}
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-popconfirm title="确定删除吗？">
            <el-button
              @click.native.prevent="deleteRow(scope.$index)"
              type="text"
              size="small"
              slot="reference"
            >
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
      />
    </template>
  </PageLayout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout.vue'
import { mapGetters } from 'vuex'
import Button from '@/components/Button/LayoutButton'

import * as time from '@/utils/time'
export default {
  components: {
    PageLayout,
    Button,
  },
  data() {
    return {
      page: {},
      data: [],
      loading: true,
    }
  },
  async created() {
    await this.getData()
  },
  computed: {
    ...mapGetters(['categories']),
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
      return time.parseDate(val, 'H:mm:ss A')
    },
    async getData(ops = {}) {
      this.loading = true
      const { page, data } = await this.$api('Post').gets({
        page: ops.page || this.page?.currentPage || 1,
        size: ops.size || this.page?.size || 10,
      })
      this.page = page
      this.data = data

      this.loading = false
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

<style lang="scss">
.el-table {
  * {
    border-right: 0 !important;
    border-left: 0 !important;
    border-top: 0 !important;
  }
}
.el-table--border {
  border: 0 !important;
}
</style>
