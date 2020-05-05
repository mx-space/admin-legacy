<template>
  <PageLayout>
    <template #header>
      <layout-button
        @click.native="$router.push({ name: 'page-edit' })"
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
      <el-table-column prop="title" label="标题" width="150">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="
              $router.push('/extra/page/edit?id=' + data[scope.$index]._id)
            "
            type="text"
            size="small"
          >
            {{ scope.row.title }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="subtitle" label="子标题"> </el-table-column>
      <el-table-column prop="created" label="创建于" width="250">
        <template slot-scope="scope">{{
          parseDate(scope.row.created)
        }}</template>
      </el-table-column>
      <el-table-column prop="modified" label="修改于" width="150">
        <template slot-scope="scope">{{
          getRelativeTime(scope.row.modified)
        }}</template>
      </el-table-column>
      <el-table-column prop="order" label="顺序" width="50"> </el-table-column>
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
  </PageLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import PageLayout from '@/layouts/PageLayout.vue'
import LayoutButton from '@/components/Button/LayoutButton.vue'
import { PagesRespDto, PageModel } from '../../../models/response.dto'
import { relativeTimeFromNow, parseDate } from '@/utils/time'

@Component({
  components: {
    PageLayout,
    LayoutButton,
  },
})
export default class PageList extends Vue {
  data: PageModel[] = []
  loading = true

  async created() {
    await this.fetchData()
  }

  async fetchData() {
    this.loading = true
    const resp = (await this.$api('Page').get()) as PagesRespDto
    this.data = resp.data

    this.loading = false
  }
  async handleDelete(index: number) {
    const _id = this.data[index]._id
    await this.$api('Page').delete(_id as string)
    this.$notice.success('删除成功')
    this.fetchData()
  }

  getRelativeTime(time: string | Date) {
    return relativeTimeFromNow(time)
  }
  get parseDate() {
    return (date: string | Date) => parseDate(date, 'LLLL')
  }
}
</script>
