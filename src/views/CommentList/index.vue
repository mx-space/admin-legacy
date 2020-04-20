<template>
  <PageLayout>
    <el-tabs v-model="activeName" @tab-click="handleToggle">
      <el-tab-pane label="待审核" name="0"></el-tab-pane>
      <el-tab-pane label="已发表" name="1"></el-tab-pane>
      <el-tab-pane label="垃圾" name="2"></el-tab-pane>
    </el-tabs>
    <el-table
      ref="multipleTable"
      :data="comments"
      tooltip-effect="dark"
      style="width: 100%;"
      @selection-change="handleSelectionChange"
      stripe
      v-loading="loading"
      ><el-table-column type="selection" width="55"> </el-table-column>

      <el-table-column label="" width="60">
        <template slot-scope="scope">
          <el-avatar
            :src="scope.row.avatar"
            icon="el-icon-user-solid"
          ></el-avatar>
        </template>
      </el-table-column>

      <el-table-column label="作者" width="200">
        <template slot-scope="scope">
          <div class="">
            <a :href="scope.row.url || ''" class="name">{{
              scope.row.author
            }}</a>
          </div>
          <div class="">
            <a :href="'mailto:' + scope.row.mail || ''" class="mail">{{
              scope.row.mail
            }}</a>
          </div>
          <div class="">
            <span class="gray">{{ scope.row.ip }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="内容">
        <template slot-scope="scope">
          <div class="gray time">
            {{ fromNow(scope.row.created) }} 于
            <span class="title">{{
              scope.row.ref && scope.row.ref.title
            }}</span>
          </div>
          <div class="content">
            {{ scope.row.text }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="center">
      <el-pagination
        layout="prev, pager, next"
        :total="pager.total"
        :current-page="pager.currentPage"
        @prev-click="handleTo(pager.currentPage - 1)"
        @next-click="handleTo(pager.currentPage + 1)"
        @current-change="handleTo"
      >
      </el-pagination>
    </div>
  </PageLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import PageLayout from '@/layouts/PageLayout.vue'
import { rest } from '../../api/rest'
import {
  CommentsRespDto,
  CommentModel,
  PagerDto,
} from '../../models/response.dto'
import { relativeTimeFromNow } from '@/utils/time'
@Component({
  components: {
    PageLayout,
  },
})
export default class CommentList extends Vue {
  activeName = '0'
  multipleSelection = [] as any[]
  comments: CommentModel[] = []
  pager: PagerDto = {} as PagerDto
  loading = true
  async created() {
    await this.fetchComments()
  }

  async fetchComments({
    page = 1,
    size = 10,
  }: {
    page?: number
    size?: number
  } = {}) {
    this.loading = true
    const resp =
      (await rest('Comment').gets({
        page,
        size,
        state: this.activeName as any,
      })) as CommentsRespDto
    this.comments = [...resp.data]
    this.pager = { ...resp.page }
    this.loading = false
  }
  handleToggle() {
    this.fetchComments()
  }
  async handleTo(page: number) {
    await this.fetchComments({ page })
  }
  toggleSelection(rows: Array<any>) {
    if (rows) {
      rows.forEach((row) => {
        ;(this.$refs.multipleTable as any).toggleRowSelection(row)
      })
    } else {
      ;(this.$refs.multipleTable as any).clearSelection()
    }
  }
  handleSelectionChange(val: any[]) {
    this.multipleSelection = val
  }
  fromNow(date: string) {
    return relativeTimeFromNow(date)
  }
}
</script>

<style lang="scss" scoped>
.center {
  text-align: center;
}

.gray {
  color: #999;
}
.title {
  color: #1890ff;
}
.meta {
  > div {
    margin-bottom: 5px;
  }
}
.body {
  .time {
    margin-bottom: 12px;
  }
}
</style>
