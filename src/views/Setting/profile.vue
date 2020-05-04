<template>
  <Layout>
    <el-row :gutter="10">
      <el-col :xs="12" :sm="12" style="padding-bottom: 1rem;" class="avatar">
        <img
          class="before"
          @load="$refs.avatar.classList.remove('before')"
          @error="$refs.avatar.classList.add('before')"
          :src="model.avatar"
          ref="avatar"
        />
      </el-col>
      <el-col :xs="12" :sm="12" style="min-height: 15rem;">
        <form action="#">
          <div class="row">
            <label>主人昵称</label>
            <div
              class="master input master_name"
              ref="username"
              @click="$refs.username.classList.add('hidden')"
            >
              {{ model.username }}
            </div>
            <input
              type="text"
              name="username"
              class="master_name"
              v-model="model.username"
              data-origin="username"
              @blur="handleBlur"
              @keyup.enter="handleBlur"
            />
          </div>
          <div class="row">
            <label>主人别名</label>
            <div
              class="master input nickname"
              ref="name"
              @click="$refs.name.classList.add('hidden')"
            >
              {{ model.name }}
            </div>
            <input
              type="text"
              name="name"
              class="master_nickname hidden"
              data-origin="name"
              v-model="model.name"
              @blur="handleBlur"
              @keyup.enter="handleBlur"
            />
          </div>
        </form>
      </el-col>
    </el-row>

    <el-row :gutter="150">
      <el-col :xs="24" :sm="12">
        <el-form ref="form1" :model="model" label-width="80px" title="信息修改">
          <el-form-item label="邮箱设定">
            <el-input v-model="model.mail"></el-input>
          </el-form-item>
          <el-form-item label="个人首页">
            <el-input v-model="model.url"></el-input>
          </el-form-item>

          <el-form-item label="头像">
            <el-input v-model="model.avatar"></el-input>
          </el-form-item>
          <el-form-item label="个人介绍">
            <el-input
              v-model="model.introduce"
              type="textarea"
              autosize
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="right">
          <parallax-button title="保存" @click="handleSave" />
        </div>
      </el-col>

      <el-col :sm="12" class="image-placeholder">
        <div class="cover">
          <img src="https://i.loli.net/2020/05/04/grkmBlO83fzHAjE.png" />
        </div>
      </el-col>
    </el-row>
  </Layout>
</template>

<script lang="ts">
import Layout from '@/layouts/PageLayout.vue'
import { Vue, Component } from 'vue-property-decorator'
import { SyntheticEvent } from 'vue-tsx-support/types/dom'
import { MasterModel } from '../../models/response.dto'
import cloneDeep from 'lodash/cloneDeep'
import pick from 'lodash/pick'
import ParallaxButton from '@/components/Button/ParallaxButton.vue'
import { pickNoEmpty } from '../../utils'
@Component({
  components: {
    Layout,
    ParallaxButton,
  },
})
export default class Profile extends Vue {
  model = {} as MasterModel
  raw = {} as MasterModel

  async fetch() {
    const data = await this.$api('Master').get<MasterModel>()
    this.model = { ...data }
    this.raw = cloneDeep(data)
  }

  created() {
    this.fetch()
  }

  async handleSave() {
    const obj = pick(this.model, ['mail', 'introduce', 'url', 'avatar'])

    const arr = Object.entries(obj)
    for (const j of arr) {
      const [key, value] = j
      if (!this.checkSameValue(key as keyof MasterModel)) {
        await this.$api('Master').patch({
          body: {
            [key]: pickNoEmpty(value),
          },
        })
        this.raw[key as keyof MasterModel] = value as any
      }
    }
  }

  checkSameValue<T extends keyof MasterModel>(key: T) {
    return this.model[key] === this.raw[key]
  }

  async handleBlur(e: SyntheticEvent<HTMLInputElement>) {
    const value = e.target.value
    const name = e.target.name

    const origin = (this.$refs as any)[e.target.dataset['origin'] as any]

    if (!this.isOnModel(name)) return

    if (this.raw[name] === value) {
      origin.classList.remove('hidden')
    } else {
      await this.$api('Master').patch({
        body: {
          [name]: pickNoEmpty(value),
        },
      })
      origin.classList.remove('hidden')
      this.$message.success('保存成功啦')
      this.raw[name] = value as any
    }
  }
  isOnModel(key: string): key is keyof MasterModel {
    return Object.keys(this.model).includes(key)
  }
}
</script>

<style lang="scss" scoped>
.avatar {
  img {
    max-width: 100px;
    border-radius: 50%;
    box-sizing: border-box;
    border: 3px solid #eee;
    transition: border 0.8s;
    transform: scale(2);
    transform-origin: left top;
    margin: 0 50px;
    position: relative;
  }
  img.before {
    width: 50px;
    height: 50px;
    border: 53px solid #eee;
  }
  @media screen and (max-width: 768px) {
    img {
      transform: none;
      margin: 0;
    }
  }
}
.row {
  overflow: hidden;
  margin-bottom: 4rem;
}
label {
  display: block;
  color: #333;
  font-weight: 800;
}
input,
textarea,
.input {
  position: absolute;
  margin: 0.8rem 0;
}
.hidden {
  visibility: hidden;
}
.master:not(.hidden) + input,
.master:not(.hidden) + textarea {
  visibility: hidden;
}
.master.hidden + input,
.master.hidden + textarea {
  visibility: visible !important;
}
.master {
  cursor: pointer;
}
input,
textarea {
  border-radius: 12px;
  border: 1px solid #eee;
  outline: none;
  transition: 0.5s border;
  box-sizing: border-box;
  padding: 0.5rem;
  min-width: 18rem;
}
textarea {
  resize: none;
}
input:focus,
textarea:focus {
  border-color: #00a0d7;
}

.image-placeholder {
  .cover {
    border-radius: 50%;
    width: 180px;
    height: 180px;
    overflow: hidden;
    position: relative;
  }
  .cover:after {
    position: absolute;
    content: '';
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    border-radius: 50%;
    box-shadow: 0 0 30px 10px rgba(255, 255, 255, 0.7) inset;
  }
  .cover::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
  }
  img {
    height: 180px;
  }
}
@media (max-width: 768px) {
  .image-placeholder {
    display: none;
  }
}
.right {
  text-align: right;
}
</style>
