<template>
  <form>
    <input type="text" v-model="username" />
    <input type="password" v-model="password" />
    <button @click="handleLogin">login</button>
  </form>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { UserDto } from '../models'
@Component
export default class Home extends Vue {
  username = ''
  password = ''
  @Action
  login!: (payload: UserDto) => undefined

  handleLogin() {
    this.login({ username: this.username, password: this.password })
  }
  @Getter
  title!: string
}
</script>
