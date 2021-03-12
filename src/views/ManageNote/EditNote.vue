<!--
 * @Author: Innei
 * @Date: 2020-05-17 16:16:26
 * @LastEditTime: 2021-03-12 11:18:16
 * @LastEditors: Innei
 * @FilePath: /admin/src/views/ManageNote/EditNote.vue
 * @Coding with Love
-->
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
        @click.native="handleSubmit"
        :icon="['fab', 'telegram-plane']"
        :name="$route.query.id ? '更新' : '发布'"
      />
    </template>
    <Writer
      :name="inputLabel"
      :title="model.title"
      :text="model.text"
      :id="id || 'note'"
      @change="onChange"
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
          <el-select
            v-model="mood"
            placeholder="请选择心情"
            allow-create
            default-first-option
            filterable
          >
            <el-option
              v-for="(value, key) in moodSet"
              :key="key"
              :label="value"
              :value="value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="天气">
          <el-select
            v-model="weather"
            placeholder="请选择天气"
            allow-create
            default-first-option
            filterable
          >
            <el-option
              v-for="(value, key) in weatherSet"
              :key="key"
              :label="value"
              :value="value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设定密码?">
          <el-input v-model="password" type="password"> </el-input>
        </el-form-item>
        <el-form-item label="多久之后公开">
          <el-date-picker
            v-model="secret"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            :picker-options="{ shortcuts }"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="隐藏?">
          <el-switch
            v-model="hide"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </el-form-item>

        <el-form-item label="是否存在回忆, 日后需要重温?">
          <el-switch
            v-model="hasMemory"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </el-form-item>

        <el-form-item label="音乐">
          <el-tag
            :key="music"
            v-for="music in musics"
            closable
            :disable-transitions="false"
            @close="handleClose(music.id)"
          >
            {{ music.id }}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="newMusicValue"
            ref="saveMusicInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
          >
          </el-input>
          <el-button
            v-else
            class="button-new-tag"
            size="small"
            @click="showInput"
            >+ 新音乐</el-button
          >
        </el-form-item>
      </el-form>
    </el-drawer>

    <el-dialog title="解析" :visible.sync="dialogVisible" width="60rem">
      <el-input type="textarea" v-model="unparsed" rows="15"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="unparsed = ''">重置</el-button>
        <el-button type="primary" @click="handleParse">确定</el-button>
      </span>
    </el-dialog>

    <template #footer>
      <button @click="() => (drawerOpen = !drawerOpen)">
        <icon :icon="['fas', 'sliders-h']" />
      </button>
    </template>
  </PageLayout>
</template>

<script lang="ts">
import Component from 'vue-class-component'

import Button from '@/components/Button/LayoutButton.vue'
import PageLayout from '@/layouts/PageLayout.vue'
import Writer, { BaseWriter } from '@/components/Writer/index.vue'
import UnderlineInput from '@/components/Input/UnderlineInput.vue'

import { NoteMusicRecord, NoteRecord } from '../../models/response.dto'
import { NoteDto } from '../../models'

import { Mixins } from 'vue-property-decorator'
import { getDayOfYear } from '@/utils/time'
import { PartialObject } from 'lodash'
import dayjs from 'dayjs'
@Component({
  components: {
    Button,
    PageLayout,
    Writer,
    UInput: UnderlineInput,
  },
})
export default class NoteWriteView
  extends Mixins(BaseWriter)
  implements PartialObject<Record<keyof NoteDto, any>> {
  options = {
    title: '树洞',
  }

  date = new Date()
  inputLabel = `记录 ${this.date.getFullYear()} 年第 ${getDayOfYear(
    this.date,
  )} 天`

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
      title: this.model.title || this.inputLabel,
      text: this.model.text,
      hide: this.hide,
      password: this.password === '' ? null : this.password,
      mood: this.mood ?? undefined,
      weather: this.weather ?? undefined,
      hasMemory: this.hasMemory,
      music: this.musics ?? [],
      secret: this.secret ?? null,
    }
    this.id
      ? await this.$api('Note').update(this.id as string, model)
      : await this.$api('Note').post(model)

    this.AfterSubmit()
    this.$router.push({ name: 'view-notes' })
  }
  onChange(model: { title: string; text: string }) {
    this.model = { ...model }
  }

  get baseUrl() {
    return process.env.VUE_APP_WEB_URL || 'http://localhost:2323'
  }

  async created() {
    if (!this.id) {
      return
    }
    const { data } = await this.$api('Note').get<{ data: NoteRecord }>(
      this.$route.query.id as string,
      {
        params: {
          single: true,
        },
      },
    )

    this.model = {
      title: data.title,
      text: data.text,
    }
    this.hide = data.hide
    this.mood = data.mood || null
    this.weather = data.weather || null
    this.hasMemory = data.hasMemory || false
    this.nid = data.nid
    this.musics = data.music ?? []
    this.secret = data.secret ?? null
    this.password = (data.password as any) ?? ''
  }
  musics: NoteMusicRecord[] = []
  handleClose(id: string) {
    // this.musics.splice(this.musics.indexOf(tag), 1)
    this.musics = [...this.musics.filter((music) => music.id !== id)]
  }
  inputVisible = false
  newMusicValue = ''
  handleInputConfirm() {
    const newTagValue = this.newMusicValue
    if (newTagValue && this.musics.every((m) => m.id !== newTagValue)) {
      this.musics.push({
        type: 'netease',
        id: this.newMusicValue,
      })
    }
    this.inputVisible = false
    this.newMusicValue = ''
  }
  showInput() {
    this.inputVisible = true
    this.$nextTick(() => {
      // @ts-ignore
      this.$refs.saveMusicInput.$refs.input.focus()
    })
  }
  hide = false
  password = null
  secret: Date | null = null
  nid: number | null = null

  mood: string | null = null

  weather: string | null = null

  hasMemory = false

  moodSet = [
    '开心',
    '伤心',
    '决心',
    '坚定',
    '痛恨',
    '生气',
    '悲哀',
    '痛苦',
    '可怕',
    '不快',
    '可恶',
    '担心',
    '绝望',
    '焦虑',
    '激动',
  ]
  weatherSet = ['晴', '多云', '雨', '阴', '雪', '雷雨']
  prefix = 'mx-space-note'

  shortcuts = [
    {
      text: '明天',
      onClick(picker) {
        picker.$emit('pick', dayjs().add(1, 'day').toDate())
      },
    },
    {
      text: '一周后',
      onClick(picker) {
        picker.$emit('pick', dayjs().add(1, 'week').toDate())
      },
    },
    {
      text: '一个月后',
      onClick(picker) {
        picker.$emit('pick', dayjs().add(1, 'month').toDate())
      },
    },
  ]
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

<style lang="scss" scoped>
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>

<style lang="scss">
.el-tag + .el-tag {
  margin-left: 10px;
}
</style>
