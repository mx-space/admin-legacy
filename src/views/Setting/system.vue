<template>
  <Layout> </Layout>
</template>

<script lang="ts">
import Layout from '@/layouts/PageLayout.vue'
import { Vue, Component } from 'vue-property-decorator'
import pick from 'lodash/pick'
import omit from 'lodash/omit'
import ParallaxButton from '@/components/Button/ParallaxButton.vue'
import { pickNoEmpty } from '../../utils'

@Component({
  components: {
    Layout,
    ParallaxButton,
  },
})
export default class SystemSettingView extends Vue {
  configs = {} as any

  async fetch() {
    const data = await this.$api('Option').get()
    this.configs = omit(data as any, ['ok', 'timestamp'])
  }

  created() {
    this.fetch()
  }
}
</script>
