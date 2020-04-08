<template>
  <div class="full bg">
    <div class="dialog">
      <Avatar :size="100" :src="avatar"></Avatar>
      <BlurInput
        type="password"
        :value="password"
        @keyup.enter.native="onSubmit"
        @change="(e) => (password = e)"
      />
      <footer style="text-align: center;">
        <Button
          style="margin-top: 12px;"
          @click="onSubmit"
          title="登陆"
        ></Button>
      </footer>
    </div>
  </div>
</template>

<script>
import Button from '@/components/Button/parallaxButton'
import Avatar from '@/components/Avatar'
import BlurInput from '@/components/Input/BlurInput'
import { mapGetters } from 'vuex'
export default {
  name: 'Login',
  components: { Button, Avatar, BlurInput },
  data() {
    return {
      logging: false,
      error: '',
      remberPassword: true,
      password: '',
    }
  },
  computed: {
    ...mapGetters(['username', 'avatar']),
  },
  mounted() {
    // this.username = localStorage.getItem('focus_username') || ''
    this.password = localStorage.getItem('focus_password') || ''
  },

  methods: {
    handleChange(e) {
      this.password = e
    },
    onSubmit() {
      if (!this.password) {
        this.$message.error('密码不正确哦')
        throw new Error('wrong password')
      }

      this.logging = true
      this.$store
        .dispatch('user/login', {
          username: this.username,
          password: this.password,
        })
        .then(() => {
          this.logging = false
          if (this.remberPassword) {
            // localStorage.setItem('focus_username', this.user.username)
            localStorage.setItem('focus_password', this.password)
          }
          this.$message.success('欢迎回来!')
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
  text-align: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  // box-shadow: 6px 9px 24px -8px #3a3737d1;
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
