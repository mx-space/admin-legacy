<template>
  <PageLayout>
    <template #header> </template>
    <el-table
      :data="data"
      style="width: 100%;"
      max-height="650"
      stripe
      v-loading="loading"
      border
    >
      <el-table-column prop="title" label="项目名称">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="
              $router.push('/extra/project/edit?id=' + data[scope.$index]._id)
            "
            type="text"
            size="small"
          >
            {{ scope.row.name }}
          </el-button>
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
import { ProjectDto } from '../../../models'
import { ProjectRespDto } from '../../../models/response.dto'

@Component({
  components: {
    PageLayout,
    LayoutButton,
  },
})
export default class ProjectList extends Vue {
  data: ProjectDto[] = []
  loading = true
  async created() {
    await this.fetchProjects()
  }

  async fetchProjects(page = 1, size = 10) {
    this.loading = false
    const { data } = (await this.$api('Project').gets({
      page,
      size,
    })) as ProjectRespDto
    this.data = data
    this.loading = false
  }
}
</script>
