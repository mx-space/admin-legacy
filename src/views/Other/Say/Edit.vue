<template>
  <PageLayout>
    <template #header>
      <layout-button
        @click.native="handlePostHitokoto"
        backcolor="#41B883"
        :icon="['far', 'save']"
        name="发布一言"
      />
      <layout-button
        @click.native="handleSubmit"
        :icon="['fab', 'telegram-plane']"
        :name="$route.query.id ? '更新' : '发布'"
      />
    </template>
    <el-form ref="form" :model="model" label-width="80px" :rules="rules"
      ><el-form-item label="内容" prop="text" required>
        <el-input
          type="textarea"
          :autosize="{ minRows: 6, maxRows: 8 }"
          :placeholder="placeholder.text"
          v-model="model.text"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input
          v-model="model.author"
          :placeholder="placeholder.author"
          auto-complete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="来源" prop="source">
        <el-input
          v-model="model.source"
          :placement="placeholder.source"
          auto-complete="off"
        ></el-input>
      </el-form-item>
    </el-form>
  </PageLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import PageLayout from '@/layouts/PageLayout.vue'
import LayoutButton from '@/components/Button/LayoutButton.vue'
import { SayDto } from '../../../models'
import { emptyString2Undefined } from '@/utils'
import { ElForm } from 'element-ui/types/form'
@Component({
  components: {
    PageLayout,
    LayoutButton,
  },
})
export default class SayEdit extends Vue {
  model: SayDto = {
    source: '',
    text: '',
    author: '',
  }

  placeholder = {
    text: '',
    author: '',
    source: '',
  }

  rules = {
    text: [{ required: true, message: '请输入正文', trigger: 'blur' }],
  }

  async created() {
    await this.getHitokoto()
    if (!this.id) {
      return
    }
    const { data } = await this.$api('Say').get(this.$route.query.id as string)
    this.model = data
  }
  async getHitokoto() {
    const json = await fetch('https://v1.hitokoto.cn/')
    const data = (await (json.json() as unknown)) as {
      id: number
      hitokoto: string
      type: string
      from: string
      from_who: string
      creator: string
      creator_uid: number
      reviewer: number
      uuid: string
      created_at: string
    }

    this.placeholder = {
      source: data.from,
      text: data.hitokoto,
      author: data.from_who || data.creator,
    }
  }

  async handlePostHitokoto() {
    await this.$api('Say').post(
      emptyString2Undefined(this.placeholder) as SayDto,
    )
    this.$message.success('发送成功~')
    this.$router.push({ name: 'say-list' })
  }

  async handleSubmit() {
    ;(this.$refs['form'] as ElForm).validate(async (valid) => {
      if (valid) {
        if (!this.id) {
          await this.$api('Say').post(
            emptyString2Undefined(this.model) as SayDto,
          )
          this.$message.success('发送成功~')
        } else {
          await this.$api('Say').update(
            this.id as string,
            emptyString2Undefined(this.model) as SayDto,
          )
          this.$message.success('修改成功~')
        }
        this.$router.push({ name: 'say-list' })
      }
    })
  }
  get id() {
    return this.$route.query.id
  }
}
</script>
