<!--
 * @Author: Innei
 * @Date: 2020-05-30 12:57:42
 * @LastEditTime: 2020-05-30 14:20:48
 * @LastEditors: Innei
 * @FilePath: /mx-admin/src/views/Setting/security.vue
 * @Code with Love
-->

<template>
  <page-layout>
    <template #header>
      <layout-button
        name="新增"
        :icon="['fas', 'plus']"
        @click.native="dialogVisible = true"
      ></layout-button>
    </template>
    <h5>生成访问令牌以便使用开放接口</h5>
    <el-table :data="tokens">
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="令牌" prop="token">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="
              scope.row.token.startsWith('**')
                ? handleShowToken(scope.row.id)
                : handleCopy(scope.row.token)
            "
          >
            {{ scope.row.token }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="过期时间" prop="expired">
        <template slot-scope="scope">
          {{ scope.row.expired ? parseTime(scope.row.expired) : '永久' }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-popconfirm
            title="确定删除吗？"
            @onConfirm="handleDelete(scope.row.id)"
          >
            <el-button type="text" size="small" slot="reference">
              移除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="生成 Token" :visible.sync="dialogVisible" width="500px">
      <el-form label-width="80px">
        <el-form-item label="名称" required>
          <el-input v-model="model.name"></el-input>
        </el-form-item>
        <el-form-item label="是否过期">
          <el-switch v-model="model.expired"></el-switch>
        </el-form-item>
        <el-form-item label="过期时间">
          <el-date-picker
            v-model="model.expiredTime"
            type="datetime"
            placeholder="datetime"
            :disabled="!model.expired"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </div>
    </el-dialog>
  </page-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import PageLayout from '@/layouts/PageLayout.vue'
import { TokenModel } from '../../models'
import LayoutButton from '@/components/Button/LayoutButton.vue'
import { parseDate } from '../../utils/time'
@Component({
  components: {
    PageLayout,
    LayoutButton,
  },
})
export default class SecurityView extends Vue {
  async created() {
    await this.fetchTokens()
  }
  tokens: TokenModel[] = []
  model = {
    name: '',
    expired: false,
    expiredTime: new Date(),
  }
  dialogVisible = false
  async fetchTokens() {
    const { data } = (await this.$api('Auth').get('token')) as any
    this.tokens = data.map((tokens) => ({
      ...tokens,
      token: '*'.repeat(40),
    })) as any
  }
  async handleAdd() {
    const payload = {
      name: this.model.name,
      expired: this.model.expired
        ? this.model.expiredTime.toISOString()
        : undefined,
    }
    await this.$api('Auth', 'token').post(payload)
    this.dialogVisible = false
    this.model = {
      name: '',
      expired: false,
      expiredTime: new Date(),
    }
    await this.fetchTokens()
    this.$message.success('生成成功')
  }
  get parseTime() {
    return (time: string) => parseDate(time, 'YYYY年M月D日 HH:mm:ss')
  }
  async handleShowToken(id: string) {
    const { token } = await this.$api('Auth').get('token', {
      params: {
        id,
      },
    })
    this.tokens = this.tokens.map((_token) => {
      if (_token.id === id) {
        _token.token = token
      }
      return _token
    })
  }
  async handleDelete(id: string) {
    await this.$api('Auth').del('token', {
      params: {
        id,
      },
    })
    await this.fetchTokens()
    this.$message.success('删除成功')
  }
  async handleCopy(text: string) {
    const el = document.createElement('textarea')
    el.value = text
    el.setAttribute('readonly', '')
    el.style.position = 'absolute'
    el.style.left = '-9999px'
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    this.$message.success('已复制令牌: ' + text)
  }
}
</script>
