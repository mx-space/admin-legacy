<template>
  <div class="full bg">
    <div class="dialog">
      <!-- <v-form>
        <v-container></v-container>
      </v-form> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  components: {},
  data() {
    return {
      logging: false,
      error: '',
      remberPassword: true,
      form: this.$form.createForm(this, { name: 'login' }),
    }
  },
  mounted() {
    this.form.setFieldsValue({
      username: localStorage.getItem('focus_username') || '',
      password: localStorage.getItem('focus_password') || '',
    })
  },
  created() {
    console.log(this.$message)
    // this.$message.success(['1', '1'])
    this.$message('1')
  },
  methods: {
    onSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.logging = true
          this.$store
            .dispatch('user/login', values)
            .then(() => {
              this.logging = false
              if (this.remberPassword) {
                localStorage.setItem('focus_username', values.username)
                localStorage.setItem('focus_password', values.password)
              }
              this.$router.push({ path: this.redirect || '/' })
            })
            .catch(() => {
              this.logging = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
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
