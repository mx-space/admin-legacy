<template>
  <PageLayout>
    <div class="grid">
      <GridCard />
    </div>
    <h4>最近收到的评论</h4>
    <el-table :data="data" style="width: 100%;">
      <el-table-column prop="created" label="时间" width="140px">
        <template slot-scope="scope">
          {{ parseTime(scope.row.created) }}
        </template>
      </el-table-column>
      <el-table-column
        header-align="left"
        align="left"
        prop="author"
        label="昵称"
        width="200px"
      >
      </el-table-column>
      <el-table-column prop="text" label="内容"> </el-table-column>
    </el-table>
    <div class="card-wrap">
      <card class="card" @click="$router.push({ name: 'edit-posts' })">
        <icon :icon="['fas', 'pencil-alt']" />
        <span>撰写新文章</span>
      </card>
      <card class="card card-2" @click="$router.push({ name: 'edit-notes' })">
        <icon :icon="['fas', 'book']" />
        <span>撰写新日记</span>
      </card>
      <card class="card card-3" @click="$router.push({ name: 'comment' })">
        <icon :icon="['fas', 'comment']" />
        <span>查看评论</span>
      </card>
      <card class="card card-4" @click="$router.push({ name: 'say-edit' })">
        <icon :icon="['far', 'comments']" />
        <span>说点什么</span>
      </card>
    </div>
  </PageLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import PageLayout from '@/layouts/PageLayout.vue'
import GridCard from './components/GridCard.vue'
import Component from 'vue-class-component'
import { parseDate } from '../../utils/time'
import Card from '@/components/Card/index.vue'
@Component({
  components: {
    PageLayout,
    GridCard,
    Card,
  },
  computed: {
    ...mapGetters(['viewport']),
  },
})
export default class Dashboard extends Vue {
  data = {} as any[]
  async created() {
    const { data } = await this.$api('Comment').gets({
      page: 1,
      size: 5,
      state: 0,
    })
    this.data = data
  }
  parseTime(date) {
    return parseDate(date, 'YYYY年M月D日')
  }
}
</script>

<style lang="scss" scoped>
.card-wrap {
  margin-top: 24px;
  text-align: center;
}
.card {
  height: 50px;
  width: 200px;
  color: #eeeeee;
  background: $blue;
  > svg {
    margin-right: 12px;
  }
}
.card-2 {
  background: $green;
}
.card-3 {
  background: #659fc9;
}
.card-4 {
  background: #a676ee;
}
</style>
