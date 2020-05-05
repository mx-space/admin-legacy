<template>
  <PageLayout>
    <template #header>
      <LayoutButton
        name="已读"
        :icon="['far', 'check-circle']"
        backcolor="#27ae60"
        @click.native="handleReadSelect"
      />
      <LayoutButton
        name="垃圾"
        :icon="['far', 'trash-alt']"
        backcolor="#e67e22"
        @click.native="handleGomiSelect"
      />
      <LayoutButton
        name="删除"
        :icon="['fa', 'times']"
        backcolor="#e74c3c"
        @click.native="dialogVisible = true"
      />
    </template>

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

      <el-table-column
        label="内容"
        :width="viewport.mobile ? '300' : undefined"
      >
        <template slot-scope="scope">
          <div class="gray time">
            {{ fromNow(scope.row.created) }} 于
            <router-link
              :to="{
                name: `edit-${scope.row.refType.toLowerCase()}s`,
                query: { id: scope.row.ref && scope.row.ref._id },
              }"
              class="title"
              >{{ scope.row.ref && scope.row.ref.title }}</router-link
            >
          </div>
          <div class="content">
            {{ scope.row.text }}
          </div>
          <blockquote class="parent" v-if="scope.row.parent">
            {{ scope.row.parent.author }} 在
            {{ fromNow(scope.row.parent.created) }} 说:
            {{ scope.row.parent.text }}
          </blockquote>
          <div class="actions">
            <span class="action green" @click="changeState(scope.row._id, 1)"
              >已读</span
            >
            <span class="action yellow" @click="changeState(scope.row._id, 2)"
              >垃圾</span
            >
            <span
              class="action"
              v-if="activeName !== '2'"
              @click="
                replyDialogVisible = true
                replyCid = scope.row._id
              "
            >
              回复
            </span>

            <el-popconfirm
              title="确定删除吗？"
              @onConfirm="handleDelete(scope.row._id)"
            >
              <span slot="reference" class="action red">删除</span>
            </el-popconfirm>
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

    <el-dialog
      :title="'回复 ' + replyContext.author"
      :visible.sync="replyDialogVisible"
      width="40%"
    >
      <el-form :model="model" label-width="90px">
        <el-form-item :label="replyContext.author + ' 说: '">
          <el-input
            type="textarea"
            :value="replyContext.text"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="回复内容">
          <el-input type="textarea" v-model="model.text" autosize></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <ParallaxButton
          @click="
            replyDialogVisible = false
            replyCid = ''
          "
          title="取消"
          type="warning"
        />
        <ParallaxButton title="提交" @click="handleReply" />
      </span>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>确定要删除么?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            handleDeleteSelect()
            dialogVisible = false
          "
          >确 定</el-button
        >
      </span>
    </el-dialog>
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

import LayoutButton from '@/components/Button/LayoutButton.vue'
import ParallaxButton from '@/components/Button/ParallaxButton.vue'
import { relativeTimeFromNow } from '@/utils/time'
import { Getter } from 'vuex-class'
import { ViewportRecord } from '../../store/interfaces/viewport.interface'

@Component({
  components: {
    LayoutButton,
    PageLayout,
    ParallaxButton,
  },
})
export default class CommentList extends Vue {
  activeName = '0'
  multipleSelection = [] as string[]
  comments: CommentModel[] = []
  pager: PagerDto = {} as PagerDto
  loading = true
  dialogVisible = false
  @Getter
  viewport!: ViewportRecord

  replyDialogVisible = false
  replyCid = ''
  model = {
    text: '',
  }

  get replyContext() {
    return this.comments.find((item) => item._id === this.replyCid) || {}
  }

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
    const resp = (await rest('Comment').gets({
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
  handleSelectionChange(val: CommentModel[]) {
    this.multipleSelection = val.map((c) => c._id)
  }
  fromNow(date: string) {
    return relativeTimeFromNow(date)
  }
  parseCommentState(state: 0 | 1 | 2) {
    return ['未读', '已读', '垃圾'][state]
  }
  async changeState(id: string | string[], state: 0 | 1 | 2) {
    if (Array.isArray(id)) {
      id.map(async (i) => {
        await this.$api('Comment').patch({ id: i, body: { state } })
      })
    } else await this.$api('Comment').patch({ id: id, body: { state } })
    this.$message.success('成功')
    await this.fetchComments()
  }
  async handleDelete(id: string | string[]) {
    if (Array.isArray(id)) {
      id.map(async (i) => {
        await this.$api('Comment').del(i)
      })
    } else await this.$api('Comment').del(id)
    await this.fetchComments()
    this.$message.success('删除成功')
  }
  handleReadSelect() {
    if (this.multipleSelection.length > 0) {
      this.changeState(this.multipleSelection, 1)
    }
  }
  handleGomiSelect() {
    if (this.multipleSelection.length > 0) {
      this.changeState(this.multipleSelection, 2)
    }
  }
  handleDeleteSelect() {
    if (this.multipleSelection.length > 0) {
      this.handleDelete(this.multipleSelection)
    }
  }
  async handleReply() {
    await rest('Comment', 'master/reply/' + this.replyCid).post({
      text: this.model.text,
    })
    this.model.text = ''
    this.replyCid = ''
    this.$message.success('回复成功了')
    this.replyDialogVisible = false
    await this.fetchComments()
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
.actions {
  margin-top: 6px;
  > span {
    margin-right: 8px;
  }
  .action {
    cursor: pointer;
  }
}
blockquote {
  position: relative;
  margin: 6px 24px;

  &::before {
    content: '';
    border-left: 3px solid #3498db;
    left: -12px;
    top: 0;
    bottom: 0;
    position: absolute;
  }
}
</style>
