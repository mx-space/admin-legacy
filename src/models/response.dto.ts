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

export interface PostRespDto extends BaseResp {
  data: {
    hide: boolean
    commentsIndex: number
    _id: string
    created: string
    modified: string
    title: string
    text: string
    slug: string
    categoryId: string
    category: CategoryRespDto
    id: string
    summary?: string
    options?: Record<string, any>
  }
}
