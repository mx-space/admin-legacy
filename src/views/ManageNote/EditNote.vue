<template>
  <PageLayout :options="options">
    <template #header>
      <Button
        @click.native="dialogVisible = true"
        :icon="['fab', 'slack-hash']"
        name="解析"
        backcolor="#34495e"
      />
      <Button
        @click.native="handleSave"
        :icon="['far', 'save']"
        backcolor="#2ecc71"
        name="保存"
      />
      <Button
        @click.native="handleSubmit"
        :icon="['fab', 'telegram-plane']"
        :name="$route.query.id ? '更新' : '发布'"
      />
    </template>
    <Writer
      :name="inputLabel"
      :title="model.title"
      :text="model.text"
      @change="onChange"
      :fullscreen="fullscreen"
    >
      <div class="url">
        <label class="prefix">{{ `${baseUrl}/notes/${nid || ''}` }}</label>
      </div>
    </Writer>

    <el-drawer
      title="文章设定"
      direction="rtl"
      :visible.sync="drawerOpen"
      class="drawer"
    >
      <el-form :model="model" label-width="80px" label-position="top">
        <el-form-item label="心情">
          <el-select v-model="mood" placeholder="请选择">
            <el-option
              v-for="(value, key) in moodSet"
              :key="key"
              :label="value"
              :value="key"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="天气">
          <el-select v-model="weather" placeholder="请选择">
            <el-option
              v-for="(value, key) in weatherSet"
              :key="key"
              :label="value"
              :value="key"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设定密码?">
          <el-input v-model="password" type="password"> </el-input>
        </el-form-item>
      </el-form>
      <el-form>
        <el-form-item label="隐藏?">
          <el-switch
            v-model="hide"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </el-form-item>
      </el-form>
    </el-drawer>

    <el-dialog title="解析" :visible.sync="dialogVisible" width="60rem">
      <el-input type="textarea" v-model="unparsed" rows="15"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="unparsed = ''">重置</el-button>
        <el-button type="primary" @click="handleParse">确 定</el-button>
      </span>
    </el-dialog>

    <template #footer>
      <button @click="() => (drawerOpen = !drawerOpen)">
        <icon :icon="['fas', 'sliders-h']" />
      </button>
      <button @click="toggleFullscreen">
        <icon :icon="['fas', 'arrows-alt']" />
      </button>
    </template>
  </PageLayout>
</template>

<script lang="ts">
import Component from 'vue-class-component'

import Button from '@/components/Button/LayoutButton.vue'
import PageLayout from '@/layouts/PageLayout.vue'
import Writer from '@/components/Writer/index.vue'
import UnderlineInput from '@/components/Input/UnderlineInput.vue'

import { NoteRespDto } from '../../models/response.dto'
import {
  NoteDto,
  MoodSet,
  WeatherSet,
  MoodValues,
  WeatherValues,
} from '../../models'
import { AutoSave } from '@/mixins/autosave'
import { Mixins } from 'vue-property-decorator'
import { FullScreenProperty } from '@/mixins/fullscreen'
@Component({
  components: {
    Button,
    PageLayout,
    Writer,
    UInput: UnderlineInput,
  },
})
export default class NoteWriteView extends Mixins(
  AutoSave,
  FullScreenProperty,
) {
  options = {
    title: '随便写点啥',
  }
  inputLabel = '想想取个什么题目比较好呢~'

  drawerOpen = false
  model = {
    title: '',
    text: '',
  }
  unparsed = ''
  dialogVisible = false
  handleParse() {
    const str = this.unparsed.trim()
    const lines = str.split('\n')
    const title = lines.slice(0, 1)[0]

    const res = title.replace('# ', '')

    this.model.title = res
    lines.shift()

    this.model.text = lines.filter(Boolean).join('\n\n')
    this.dialogVisible = false
    this.unparsed = ''
  }

  async handleSubmit() {
    const model: NoteDto = {
      ...this.model,
      hide: this.hide,
      password: this.password === '' ? undefined : this.password,
      mood: this.mood,
      weather: this.weather ?? undefined,
    }
    this.id
      ? await this.$api('Note').update(this.id as string, model)
      : await this.$api('Note').post(model)
    this.$notice.success('发布成功')
    this.$router.push({ name: 'view-notes' })
  }
  onChange(model: { title: string; text: string }) {
    this.model = { ...model }
  }

  get baseUrl() {
    return process.env.VUE_APP_WEB_URL || 'http://localhost:2323'
  }

  get id() {
    return this.$route.query.id
  }

  async created() {
    if (!this.id) {
      return
    }
    const { data } = await this.$api('Note').get<NoteRespDto>(
      this.$route.query.id as string,
    )

    this.model = {
      title: data.title,
      text: data.text,
    }
    this.hide = data.hide
    this.mood = (data.mood as MoodValues) ?? 'happy'
    this.nid = data.nid
  }

  hide = false
  password = ''
  nid: number | null = null

  mood: MoodValues = 'happy'
  moodSet = MoodSet

  weather: WeatherValues | null = null
  weatherSet = WeatherSet

  prefix = 'mx-space-note'
}
</script>
<style lang="scss" scoped>
.url {
  color: #666;

  input {
    width: 8rem;
  }
}
</style>
