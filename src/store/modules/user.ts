import { rest } from '@/api/rest'
import { LoginDto } from '@/models'
import { LoginRespDto } from '@/models/response.dto'
import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { setToken, getToken } from '@/utils/auth'
@Module({ namespaced: true })
export class UserModule extends VuexModule {
  token: string | null = getToken() || null
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

  @Action({ commit: 'SET_MASTER', rawError: true })
  async fetchMaster() {
    return await rest('Master').gets()
  }
  @Mutation
  SET_MASTER(payload: Partial<LoginRespDto>) {
    const { username, name, avatar } = payload
    this.username = username
    this.name = name
    this.avatar = avatar
  }

  @Mutation
  SET_USER(payload: LoginRespDto) {
    // console.log(payload)
    const {
      token,
      lastLoginIp,
      lastLoginTime,
      username,
      mail,
      name,
      created,
      avatar,
      expiresIn,
    } = payload

    setToken(token, expiresIn)
    this.token = token
    this.lastLoginIp = lastLoginIp
    this.lastLoginTime = new Date(lastLoginTime)
    this.username = username
    this.name = name
    this.avatar = avatar
    this.raw = payload
  }
}
