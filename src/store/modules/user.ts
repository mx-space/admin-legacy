import { rest } from '@/api/rest'
import { LoginDto } from '@/models'
import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { LoginRespDto } from '@/models/response.dto'
@Module({ name: 'user' })
export class UserModule extends VuexModule {
  token: string | null = null
  name?: string = ''
  avatar?: string = ''
  username?: string = ''
  id?: string
  lastLoginIp?: string
  lastLoginTime?: Date
  raw: any = null

  @Action({ commit: 'SET_USER', rawError: true })
  async login(data: LoginDto) {
    return await rest('Master', 'login').post(data)
  }

  @Mutation
  SET_USER(payload: LoginRespDto) {
    // console.log(payload)
    const { token, lastLoginIp, lastLoginTime } = payload
    this.token = token
    this.lastLoginIp = lastLoginIp
    this.lastLoginTime = new Date(lastLoginTime)
  }
}
