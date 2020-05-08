<template>
  <Layout>
    <template #header>
      <layout-button
        name="保存"
        :icon="['far', 'check-circle']"
        backcolor="#27ae60"
        @click.native="handleSave"
      ></layout-button>
    </template>
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item name="0" title="网站设置">
        <el-form :model="configs" label-width="8rem">
          <el-form-item label="前端地址">
            <el-input
              v-model="configs.url.webUrl"
              v-if="configs.url"
            ></el-input>
          </el-form-item>
          <el-form-item label="后端地址">
            <el-input
              v-model="configs.url.serverUrl"
              v-if="configs.url"
            ></el-input>
          </el-form-item>
          <el-form-item label="管理后台地址">
            <el-input
              v-model="configs.url.adminUrl"
              v-if="configs.url"
            ></el-input>
          </el-form-item>
          <el-form-item label="WebSocket 地址">
            <el-input v-model="configs.url.wsUrl" v-if="configs.url"></el-input>
          </el-form-item>
        </el-form>
      </el-collapse-item>

      <el-collapse-item name="0-0" title="SEO 优化">
        <el-form :model="configs" label-width="8rem" v-if="configs.seo">
          <el-form-item label="网站标题">
            <el-input v-model="configs.seo.title"></el-input>
          </el-form-item>
          <el-form-item label="网站描述">
            <el-input v-model="configs.seo.description"></el-input>
          </el-form-item>
          <el-form-item label="关键字">
            <el-tag
              v-for="tag in (configs.seo.keywords || [])"
              :key="tag"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)"
              style="margin-right: 1rem;"
            >
              {{ tag }}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-input>
            <el-button
              v-else
              class="button-new-tag"
              size="small"
              @click="showInput"
              >+ 新关键字</el-button
            >
          </el-form-item>
        </el-form>
      </el-collapse-item>

      <el-collapse-item name="1" title="评论设置">
        <el-form
          :model="configs"
          label-width="10rem"
          v-if="configs.commentOptions"
        >
          <el-form-item label="反垃圾邮件">
            <el-switch
              v-model="configs.commentOptions.antiSpam"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </el-form-item>
          <el-form-item label="反垃圾邮件 ApiKey">
            <el-input
              v-model="configs.commentOptions.akismetApiKey"
              placeholder="前往 https://akismet.com/ 注册"
              type="password"
              :disabled="!configs.commentOptions.antiSpam"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item
        name="2"
        title="评论回复设置"
        v-if="configs.mailOptions"
      >
        <el-form
          :model="configs"
          label-width="8rem"
          v-if="configs.mailOptions"
          label-position="left"
        >
          <el-form-item label="开启评论邮箱提醒">
            <el-switch
              v-model="configs.mailOptions.enable"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </el-form-item>

          <el-form-item label="邮箱地址">
            <el-input
              v-model="configs.mailOptions.user"
              :disabled="!configs.mailOptions.enable"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱密码">
            <el-input
              v-model="configs.mailOptions.pass"
              :disabled="!configs.mailOptions.enable"
              type="password"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-collapse-item>

      <el-collapse-item name="4" title="图床设定">
        <el-form :model="configs" label-width="8rem">
          <el-form-item label="图床类型">
            <el-select v-model="configs.imageBed.type" placeholder="">
              <el-option
                v-for="item in imageBedType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="仓库地址">
            <el-input v-model="configs.imageBed.repo"></el-input>
          </el-form-item>
          <el-form-item label="Repo Token">
            <el-input
              v-model="configs.imageBed.token"
              type="password"
            ></el-input>
          </el-form-item>
          <el-form-item label="自定义前缀">
            <el-input v-model="configs.imageBed.customUrl"></el-input>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item name="5" title="备份">
        <el-form :model="configs" label-width="8rem">
          <el-form-item label="开启备份">
            <el-switch
              v-model="configs.backupOptions.enable"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </el-form-item>
          <el-form-item label="地域">
            <el-input v-model="configs.backupOptions.Region"></el-input>
            <p><small>支持备份到 COS</small></p>
          </el-form-item>
          <el-form-item label="存储桶名称">
            <el-input v-model="configs.backupOptions.Bucket"></el-input>
          </el-form-item>
          <el-form-item label="SecretId">
            <el-input v-model="configs.backupOptions.SecretId"></el-input>
          </el-form-item>
          <el-form-item label="SecretKey">
            <el-input
              v-model="configs.backupOptions.SecretKey"
              type="password"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
  </Layout>
</template>

<script lang="ts">
import Layout from '@/layouts/PageLayout.vue'
import { Vue, Component } from 'vue-property-decorator'
import pick from 'lodash/pick'
import omit from 'lodash/omit'
import ParallaxButton from '@/components/Button/ParallaxButton.vue'
import { pickNoEmpty, difference } from '../../utils'
import { IConfig } from '../../models'
import cloneDeep from 'lodash/cloneDeep'
import LayoutButton from '@/components/Button/LayoutButton.vue'
import { ElInput } from 'element-ui/types/input'
import { isEmpty, merge } from 'lodash/fp'
@Component({
  components: {
    Layout,
    LayoutButton,
    ParallaxButton,
  },
})
export default class SystemSettingView extends Vue {
  activeName = '0'
  inputVisible = false
  inputValue = ''
  configs: IConfig = {} as IConfig
  raw: IConfig = {} as IConfig

  imageBedType = [
    {
      value: 'github',
      label: 'GitHub',
    },
  ]

  async fetch() {
    const data = await this.$api('Option').get()
    const configs = this.fullConfigs(
      omit(data as any, ['ok', 'timestamp']) as IConfig,
    )

    this.configs = configs
    this.raw = cloneDeep(this.configs)
  }

  fullConfigs(configs: object): IConfig {
    return merge(
      {
        seo: { title: '', description: '', keywords: [] },
        url: {
          wsUrl: '',
          adminUrl: '',
          serverUrl: '',
          webUrl: '',
        },
        imageBed: {
          customUrl: '',
          repo: '',
          token: '',
          type: 'github',
        },
        mailOptions: {
          user: '',
          pass: '',
          enable: false,
        },
        commentOptions: {
          antiSpam: false,
          akismetApiKey: '',
        },
        backupOptions: {
          enable: false,
          SecretId: '',
          SecretKey: '',
          Bucket: '',
          Region: '',
        },
      },
      configs,
    ) as IConfig
  }

  created() {
    this.fetch()
  }
  async handleSave() {
    const diff = difference(this.configs, this.raw)
    if (!isEmpty(diff)) {
      console.log(diff)

      const entries = Object.entries(diff)

      for await (const [key, value] of entries) {
        if (key === 'seo') {
          await this.$api('Option').patch({
            id: key,
            body: { ...(value as any), keywords: this.configs.seo.keywords },
          })
        } else {
          await this.$api('Option').patch({ id: key, body: value })
        }
      }

      await this.fetch()
      this.$message.success('修改成功')
    }
  }

  handleClose(tag: string) {
    this.configs.seo.keywords!.splice(
      this.configs.seo.keywords!.indexOf(tag),
      1,
    )
  }

  showInput() {
    this.inputVisible = true
    this.$nextTick(() => {
      ;((this.$refs.saveTagInput as ElInput).$refs as any).input.focus()
    })
  }

  handleInputConfirm() {
    const inputValue = this.inputValue
    if (inputValue) {
      if (!this.configs.seo.keywords) {
        this.configs.seo.keywords = []
      }
      this.configs.seo.keywords.push(inputValue)
    }
    this.inputVisible = false
    this.inputValue = ''
  }
}
</script>
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
