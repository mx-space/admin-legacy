<template>
  <div class="full bg">
    <div class="dialog">
      <el-card class="box-card"
        ><div slot="header" class="clearfix">
          <span>登陆</span>
        </div>
        <el-form
          v-model="user"
          label-position="left"
          label-width="80px"
          status-icon
          @submit.native.prevent
          class="form"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="user.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="user.password"
              type="password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-checkbox v-model="remberPassword">记住密码</el-checkbox>
        </el-form>

        <footer style="text-align: center;">
          <Button
            style="margin-top: 12px;"
            @click="onSubmit"
            title="登陆"
          ></Button>
        </footer>
      </el-card>
    </div>
  </div>
</template>

<script>
import Button from '@/components/button/parallaxButton'
export default {
  name: 'Login',
  components: { Button },
  data() {
    return {
      logging: false,
      error: '',
      remberPassword: true,
      user: {
        username: '',
        password: '',
      },
    }
  },
  mounted() {
    this.username = localStorage.getItem('focus_username') || ''
    this.password = localStorage.getItem('focus_password') || ''
  },

  methods: {
    onSubmit() {
      if (!this.user.username || !this.user.password) {
        this.$message.error('用户名或密码不正确哦')
        throw new Error('wrong username or password')
      }

      this.logging = true
      this.$store.dispatch('user/login', this.user).then(() => {
        this.logging = false
        if (this.remberPassword) {
          localStorage.setItem('focus_username', this.user.username)
          localStorage.setItem('focus_password', this.user.password)
        }
        this.$router.push({ path: this.redirect || '/' })
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.full {
  min-height: 100vh;
  min-width: 100vw;
  margin: 0;
  padding: 0;
  position: relative;
}
.bg {
  background: $deepBg;
}
.dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 6px 9px 24px -8px #3a3737d1;
  overflow: hidden;
  border-radius: 24px;
}
.card {
  width: 300px;
}
.form {
  padding: 0 0.5rem;
}
</style>

<style lang="scss">
.ant-form-item:last-child {
  margin-bottom: 0;
}
.ant-form-item:nth-last-child(2),
.ant-form-item:nth-last-child(3) {
  margin-bottom: 2px;
}
</style>
