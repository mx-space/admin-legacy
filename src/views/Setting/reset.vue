<template>
  <page-layout>
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item name="1" title="修改密码">
        <el-form
          style="max-width: 30rem"
          ref="passForm"
          :model="pass"
          label-width="8rem"
          :rules="passRules"
        >
          <!-- <el-form-item label="当前密码" prop="cur">
            <el-input
              v-model="pass.cur"
              placeholder="当前密码"
              type="password"
              required
            ></el-input>
          </el-form-item> -->
          <el-form-item label="新密码" prop="pass">
            <el-input
              v-model="pass.pass"
              placeholder="新密码"
              type="password"
              required
            ></el-input>
          </el-form-item>
          <el-form-item label="重复新密码" prop="repeat">
            <el-input
              v-model="pass.repeat"
              placeholder="重复新密码"
              type="password"
              required
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleChangePass">
              保存
            </el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
  </page-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import PageLayout from '@/layouts/PageLayout.vue'
import { ElForm } from 'element-ui/types/form'

@Component({
  components: {
    PageLayout,
  },
})
export default class ResetView extends Vue {
  activeName = '1'
  pass = {
    cur: '',
    pass: '',
    repeat: '',
  }

  passRules = {
    // cur: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
    pass: [{ required: true, trigger: 'blur' }],
    repeat: [{ required: true, trigger: 'blur' }],
  }

  handleChangePass() {
    ;(this.$refs.passForm as ElForm).validate(async (valid) => {
      if (valid) {
        if (this.pass.pass !== this.pass.repeat) {
          return this.$message.error('两次密码不匹配')
        }

        await this.$api('Master').patch({
          body: {
            password: this.pass.pass,
          },
        })
        this.$message.success('修改成功')
        this.$router.push('/login')
      }
    })
  }
}
</script>
