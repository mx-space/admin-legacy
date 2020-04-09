<template>
  <PageLayout>
    <template #header>
      <Button
        name="撰写"
        :icon="['fas', 'plus']"
        @click.native="$router.push({ name: 'edit-posts' })"
      />
    </template>
    <Table
      :data="data"
      :page="page"
      :cols="cols"
      :options="options"
      :loading="loading"
      @to="handleTo"
    >
      <template #actions="{row}">
        <span class="action_btn primary" @click="handleEdit(row)">编辑</span>
        <!-- <a-popconfirm
          title="你确定要删除此文章吗?"
          @confirm="confirm(row)"
          ok-text="是"
          cancel-text="再想想啦"
        >
          <span class="action_btn danger">删除</span>
        </a-popconfirm> -->
      </template>
    </Table>
  </PageLayout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout.vue'
import Table from '@/components/Table'
import Button from '@/components/Button/LayoutButton'

import * as time from '@/utils/time'
export default {
  components: {
    PageLayout,
    Table,
    Button,
  },
  data() {
    return {
      page: {},
      data: [],
      raw: null,
      options: {
        showID: true,
        style: {
          width: '100%',
          height: 'calc(100vh - 13rem)',
        },
      },
      cols: [
        {
          name: '标题',
          prop: 'title',
          width: 100,
          tag: 'router-link',
          options: {
            attrs: {
              to: {
                ref: true,
                prop: '_id',
                prefix: '/posts/edit?id=',
              },
            },
            class: ['title'],
          },
        },
        {
          name: '分类',
          prop: 'categoryId.name',
          width: 100,
        },
        {
          name: '创建时间',
          prop: 'created',
          width: 150,
        },
        {
          name: '修改于',
          prop: 'modified',
          width: 150,
        },
        {
          name: '操作',
          actions: true,
        },
      ],
      loading: true,
    }
  },
  async created() {
    await this.getData()
  },
  methods: {
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
    async getData(ops = {}) {
      this.loading = true
      const { page, data } = await this.$api('Post').gets({
        page: ops.page || 1,
        size: ops.size || 10,
      })
      ;(this.page = page), (this.raw = data)

      this.data = data.map((item) =>
        Object.fromEntries(
          Object.entries(item).map(([key, val]) => {
            switch (key) {
              case 'modified': {
                return [key, time.relativeTimeFromNow(val)]
              }
              case 'created': {
                return [key, time.parseDate(val, 'H:mm:ss A')]
              }
              default: {
                return [key, val]
              }
            }
          }),
        ),
      )
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
