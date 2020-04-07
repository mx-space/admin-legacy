<template>
  <div class="full bg">
    <div class="dialog">
      <Card class="card" title="欢迎回来~">
        <Form @submit="onSubmit" :form="form" class="form">
          <FormItem>
            <AInput
              size="large"
              placeholder="请输入账户名"
              v-decorator="[
                'username',
                {
                  rules: [
                    {
                      required: true,
                      message: '请输入账户名',
                      whitespace: true,
                    },
                  ],
                },
              ]"
            >
              <icon slot="prefix" :icon="['fas', 'user']" />
            </AInput>
          </FormItem>
          <FormItem>
            <AInput
              size="large"
              placeholder="请输入密码"
              type="password"
              v-decorator="[
                'password',
                {
                  rules: [
                    { required: true, message: '请输入密码', whitespace: true },
                  ],
                },
              ]"
            >
              <icon slot="prefix" :icon="['fas', 'key']" />
            </AInput>
          </FormItem>
          <FormItem>
            <Checkbox
              :checked="remberPassword"
              @change="(e) => (this.remberPassword = e.target.checked)"
            >
              记住密码
            </Checkbox>
          </FormItem>
          <FormItem>
            <Button
              :loading="logging"
              style="width: 100%; margin-top: 12px;"
              size="large"
              html-type="submit"
              @click="onSubmit"
              type="primary"
              >登录</Button
            >
          </FormItem>
        </Form>
      </Card>
    </div>
  </div>
</template>

<script>
import { Card, Form, Input as AInput, Button, Checkbox } from 'ant-design-vue'
export default {
  name: 'Login',
  components: {
    Card,
    Form,
    FormItem: Form.Item,
    AInput,
    Button,
    Checkbox,
  },
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
