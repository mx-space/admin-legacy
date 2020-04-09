interface BaseResp {
  ok: 1 | 0
  timestamp: string
}

export interface LoginRespDto {
  ok: number
  timestamp: Date
  token: string
  lastLoginTime: Date
  lastLoginIp: string
  name: string
  username: string
  created: Date
  url: string
  mail: string
  avatar: string
  expiresIn: number
}

export enum CategoryType {
  Category,
  Tag,
}
export interface CategoryRespDto {
  type: keyof typeof CategoryType
  count: number
  _id: string
  created: string
  slug: string
  name: string
  modified: string
}
export interface CategoriesRespDto extends BaseResp {
  data: CategoryRespDto[]
}
