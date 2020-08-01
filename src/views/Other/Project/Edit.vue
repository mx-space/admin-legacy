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
      <el-form-item label="项目图标" prop="avatar">
        <el-input v-model="model.avatar" auto-complete="off"></el-input>
      </el-form-item>

      <el-form-item label="预览图片" prop="images">
        <el-tag
          :key="image"
          v-for="image in model.images"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >
          {{ image }}
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
        <el-button v-else class="button-new-tag" size="small" @click="showInput"
          >+ New
        </el-button>
      </el-form-item>

      <el-form-item label="正文" prop="text" required>
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 6 }"
          v-model="model.text"
          placeholder="在这里介绍一下你的项目吧"
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
import { ProjectDto } from '../../../models'

import { ElForm } from 'element-ui/types/form'

@Component({
  components: {
    PageLayout,
    LayoutButton,
  },
})
export default class ProjectEdit extends Vue {
  model: ProjectDto = {
    name: '',
    previewUrl: '',
    docUrl: '',
    projectUrl: '',
    images: [],
    description: '',
    avatar: '',
    text: '',
  }
  inputVisible = false
  inputValue = ''
  rules = {
    name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
    description: [
      { required: true, message: '请输入描述信息', trigger: 'blur' },
    ],
    text: [{ required: true, message: '请输入正文', trigger: 'blur' }],
  }

  async created() {
    if (!this.id) {
      return
    }
    const { data } = await this.$api('Project').get(
      this.$route.query.id as string,
    )
    this.model = data
  }

  async handleSubmit() {
    ;(this.$refs['form'] as ElForm).validate(async (valid) => {
      if (valid) {
        if (!this.id) {
          await this.$api('Project').post(this.model as ProjectDto)
          this.$message.success('发送成功~')
        } else {
          await this.$api('Project').update(
            this.id as string,
            this.model as ProjectDto,
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

  handleClose(tag) {
    this.model.images!.splice(this.model.images!.indexOf(tag), 1)
  }

  showInput() {
    this.inputVisible = true
    this.$nextTick(() => {
      ;(this.$refs.saveTagInput as any).$refs.input.focus()
    })
  }

  handleInputConfirm() {
    const inputValue = this.inputValue
    if (inputValue) {
      if (this.model.images) {
        this.model.images.push(inputValue)
      } else {
        this.model.images = [inputValue]
      }
    }
    this.inputVisible = false
    this.inputValue = ''
  }
}
</script>

<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
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
