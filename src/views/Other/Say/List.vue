<template>
  <PageLayout>
    <template #header>
      <layout-button
        @click.native="$router.push({ name: 'say-edit' })"
        :icon="['fas', 'plus']"
        name="新增"
    /></template>
    <el-table
      :data="data"
      style="width: 100%"
      max-height="650"
      stripe
      v-loading="loading"
    >
      <el-table-column prop="created" label="创建于" width="150">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="
              $router.push('/extra/say/edit?id=' + data[scope.$index].id)
            "
            type="text"
            size="small"
          >
            {{ getRelativeTime(scope.row.created) }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="text" label="内容"> </el-table-column>
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
      />
    </template>
  </PageLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import PageLayout from '@/layouts/PageLayout.vue'
import LayoutButton from '@/components/Button/LayoutButton.vue'
import { SayDto } from '../../../models'
import { ProjectRespDto, PagerDto } from '../../../models/response.dto'
import { relativeTimeFromNow } from '@/utils/time'

@Component({
  components: {
    PageLayout,
    LayoutButton,
  },
})
export default class SayList extends Vue {
  data: SayDto[] = []
  loading = true
  page: PagerDto = {} as PagerDto
  async created() {
    await this.fetchData()
  }

  async fetchData(page = 1, size = 10) {
    this.loading = true
    const resp = (await this.$api('Say').gets({
      page,
      size,
    })) as ProjectRespDto
    this.data = resp.data
    this.page = resp.page
    this.loading = false
  }
  async handleDelete(index: number) {
    const id = this.data[index].id
    await this.$api('Say').delete(id as string)
    this.$notice.success('删除成功')
    this.fetchData()
  }

  getRelativeTime(time: string | Date) {
    return relativeTimeFromNow(time)
  }

  handleTo(page: number) {
    this.fetchData(page)
  }
}
</script>
