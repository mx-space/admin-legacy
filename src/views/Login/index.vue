<template>
  <div class="full bg">
    <img
      class="wallpaper"
      :class="{ loading }"
      src="https://i.loli.net/2020/04/08/OseRqS2jn7WaJKM.png"
      @load="loading = false"
      @error="loading = true"
    />

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
import Button from '@/components/Button/ParallaxButton'
import Avatar from '@/components/Avatar'
import BlurInput from '@/components/Input/BlurInput'
import { mapGetters } from 'vuex'
export default {
  name: 'Login',
  components: { Button, Avatar, BlurInput },
  data() {
    return {
      logging: false,
      loading: true,
      error: '',
      remberPassword: true,
      password: '',
    }
  },
  computed: {
    ...mapGetters(['username', 'avatar']),
  },
  created() {
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
  position: relative;
  overflow: hidden;
}
.wallpaper {
  z-index: 0;
  max-width: 100%;
  max-height: 100%;
  transform: scale(2);
  transform-origin: top;
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
