<template>
  <PageLayout>
    <template #header>
      <Button
        name="撰写"
        :icon="['fas', 'plus']"
        @click.native="$router.push({ name: 'edit-posts' })"
      />
    </template>
    <el-table :data="data" style="width: 100%;" max-height="650" stripe>
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
      <el-table-column prop="title" label="分类" width="100">
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
          <el-button
            @click.native.prevent="deleteRow(scope.$index, tableData)"
            type="text"
            size="small"
          >
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
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
        page: ops.page || 1,
        size: ops.size || 10,
      })
      this.page = page
      this.data = data

      this.loading = false
    },
    async confirm({ id }) {
      const { deletedCount, msg } = await this.$api('Post').del(id)
      if (deletedCount) {
        this.$message.success(msg)
        this.getData({ page: this.page.currentPage })
      } else {
        this.$message.error(msg)
      }
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
</style>
