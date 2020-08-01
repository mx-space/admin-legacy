<template>
  <PageLayout>
    <template #header>
      <layout-button
        @click.native="handleSubmit"
        :icon="['fab', 'telegram-plane']"
        :name="$route.query.id ? '更新' : '发布'"
      />
    </template>

    <Writer
      name="愿你有个好心情"
      :title="model.title"
      :text="model.text"
      @change="
        ({ title, text }) => {
          ;(model.title = title), (model.text = text)
        }
      "
      :id="id || 'page'"
    >
      <div class="subtitle">
        <UInput
          :value="model.subtitle"
          @change="(e) => (model.subtitle = e)"
          placeholder="副标题"
        />
      </div>
      <div class="url">
        <label class="prefix">{{ `${baseUrl}/` }}</label>
        <UInput :value="model.slug" @change="(e) => (model.slug = e)" />
      </div>
    </Writer>
    <el-drawer
      title="页面设定"
      direction="rtl"
      :visible.sync="drawerOpen"
      class="drawer"
    >
      <el-form>
        <el-form-item label="页面顺序">
          <el-input v-model="model.order"> </el-input>
        </el-form-item>
      </el-form>
    </el-drawer>
    <template #footer>
      <button @click="() => (drawerOpen = !drawerOpen)">
        <icon :icon="['fas', 'sliders-h']" />
      </button>
    </template> </PageLayout
></template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import PageLayout from '@/layouts/PageLayout.vue'
import LayoutButton from '@/components/Button/LayoutButton.vue'
import { EnumPageType, PageDto } from '../../../models'
import { pickNoEmpty } from '@/utils'
import Writer, { BaseWriter } from '@/components/Writer/index.vue'
import UnderlineInput from '@/components/Input/UnderlineInput.vue'
import { Mixins } from 'vue-property-decorator'

@Component({
  components: {
    PageLayout,
    LayoutButton,
    Writer,
    UInput: UnderlineInput,
  },
})
export default class PageList extends Mixins(BaseWriter) {
  model: PageDto = {
    title: '',
    subtitle: '',
    type: EnumPageType.md,
    text: '',
    slug: '',
    order: 0,
  }
  drawerOpen = false

  get baseUrl() {
    return process.env.VUE_APP_WEB_URL || 'http://localhost:2323'
  }
  async created() {
    if (!this.id) {
      return
    }
    const { data } = await this.$api('Page').get(this.$route.query.id as string)
    this.model = data
  }

  async handleSubmit() {
    if (!this.id) {
      await this.$api('Page').post(pickNoEmpty(this.model) as PageDto)
    } else {
      await this.$api('Page').update(
        this.id as string,
        {
          ...pickNoEmpty(this.model),
          subtitle: this.model.subtitle || null,
        } as PageDto,
      )
    }
    this.AfterSubmit()

    this.$router.push({ name: 'page-list' })
  }
}
</script>

<style lang="scss">
.subtitle {
  margin: 12px 0;
  font-size: 0.8rem;
  > input {
    width: 50%;
    color: #888;
  }
}
</style>
