<template>
  <PageLayout>
    <template #header>
      <layout-button
        @click.native="handleSubmit"
        :icon="['fab', 'telegram-plane']"
        :name="$route.query.id ? '更新' : '发布'"
      />
    </template>
    <el-form ref="form" :model="model" label-width="80px" :rules="rules">
      <el-form-item label="项目名称" prop="name" required>
        <el-input v-model="model.name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="文档地址" prop="docUrl">
        <el-input v-model="model.docUrl" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="项目地址">
        <el-input v-model="model.projectUrl" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="预览地址">
        <el-input v-model="model.previewUrl" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="项目描述" prop="description" required>
        <el-input v-model="model.description" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="正文" prop="text" required>
        <codemirror v-model="model.text" ref="code" :options="cmOptions" />
      </el-form-item>
    </el-form>
  </PageLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import PageLayout from '@/layouts/PageLayout.vue'
import LayoutButton from '@/components/Button/LayoutButton.vue'
import { ProjectDto } from '../../../models'
import { codemirror } from 'vue-codemirror'
import { cmOptions } from '@/commom/editor'
import { Editor } from 'codemirror'
import { pickNoEmpty } from '@/utils'
import { ElForm } from 'element-ui/types/form'
@Component({
  components: {
    PageLayout,
    LayoutButton,
    codemirror,
  },
})
export default class ProjectList extends Vue {
  model: ProjectDto = {
    name: '',
    previewUrl: '',
    docUrl: '',
    projectUrl: '',
    images: [], // todo
    description: '',
    avatar: '', // todo
    text: '',
  }

  rules = {
    name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
    description: [
      { required: true, message: '请输入描述信息', trigger: 'blur' },
    ],
    text: [{ required: true, message: '请输入正文', trigger: 'blur' }],
  }
  cmOptions = cmOptions
  async created() {
    if (!this.id) {
      return
    }
    const { data } = await this.$api('Project').get(
      this.$route.query.id as string,
    )
    this.model = data
  }
  mounted() {
    // window.cm = this.$refs.code.codemirror
    setTimeout(() => {
      const Editor: Editor = (this.$refs.code as any)?.codemirror
      Editor.setSize(null, null)
      Editor.refresh()
    }, 2000)
  }
  async handleSubmit() {
    ;(this.$refs['form'] as ElForm).validate(async (valid) => {
      if (valid) {
        if (!this.id) {
          await this.$api('Project').post(pickNoEmpty(this.model) as ProjectDto)
          this.$message.success('发送成功~')
        } else {
          await this.$api('Project').update(
            this.id as string,
            pickNoEmpty(this.model) as ProjectDto,
          )
          this.$message.success('修改成功~')
        }
        this.$router.push({ name: 'project-list' })
      }
    })
  }
  get id() {
    return this.$route.query.id
  }
}
</script>
<style>
.el-form-item__content .vue-codemirror {
  line-height: 1.3 !important;
}
</style>
