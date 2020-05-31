<!--
 * @Author: Innei
 * @Date: 2020-05-31 19:23:10
 * @LastEditTime: 2020-05-31 20:01:11
 * @LastEditors: Innei
 * @FilePath: /mx-admin/src/views/Optimize/index.vue
 * @Coding with Love
-->

<template>
  <page-layout>
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item name="0" title="图片信息重置">
        <el-button type="primary" @click="handleImageDimensions"
          >重置</el-button
        >
        <section class="log" v-html="log.join('<br />')" ref="log"></section>
      </el-collapse-item>
    </el-collapse>
  </page-layout>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import PageLayout from '@/layouts/PageLayout.vue'
import LayoutButton from '@/components/Button/LayoutButton.vue'
import client from '../../socket'
import { EventTypes } from '../../socket/types'
@Component({ components: { PageLayout, LayoutButton } })
export default class Optimize extends Vue {
  activeNames = ['0']
  log = [] as string[]

  @Watch('log')
  scrollToBottom() {
    ;(this.$refs.log as HTMLElement).scrollTo({
      top: (this.$refs.log as HTMLElement).scrollHeight,
    })
  }

  async handleImageDimensions() {
    const id = client.socket.id
    this.$events.$on(EventTypes.IMAGE_FETCH, (data) => {
      this.log.push(data)
    })
    await this.$api('Option').get('refresh_images', {
      params: { socket_id: id },
    })
  }
}
</script>

<style lang="scss" scoped>
.log {
  height: 300px;
  max-width: 70vw;
  background: #333;
  color: #fff;
  border-radius: 8px;
  margin-top: 12px;
  overflow: auto;
  padding: 8px;
}
</style>
