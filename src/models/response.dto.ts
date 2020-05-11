import { ProjectDto, SayDto } from '.'

interface BaseResp {
  ok: 1 | 0
  timestamp: string
}
interface BaseModel {
  created?: string
  modified?: string
  _id?: string
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
  type: CategoryType
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

export interface PagerDto {
  total: number
  size: number
  currentPage: number
  totalPage: number
  hasPrevPage: boolean
  hasNextPage: boolean
}

export interface NoteRecord {
  _id: string
  hide: boolean
  count: {
    read: number
    like: number
  }
  title: string
  text: string
  mood?: string
  weather?: string
  created: string
  modified: string
  nid: number
}

export interface NotesRespDto extends BaseResp {
  data: NoteRecord[]
}
export interface NoteRespDto extends BaseResp {
  data: NoteRecord
}

export interface CommentModel {
  refType: string
  state: number
  children: CommentModel[]
  commentsIndex: number
  _id: string
  author: string
  text: string
  mail: string
  url: string
  ip: string
  agent: string
  key: string
  pid: string
  created: string
  modified: string
  avatar: string
  id: string
}

export interface CommentsRespDto extends BaseResp {
  data: CommentModel[]
  page: PagerDto
}

export interface ProjectRespDto extends BaseResp {
  data: ProjectDto[]
  page: PagerDto
}
export interface SayRespDto extends BaseResp {
  data: SayDto[]
  page: PagerDto
}

export interface PageModel {
  commentsIndex: number
  order: number
  _id: string
  created: Date
  modified: Date
  title: string
  slug: string
  id: string
  subtitle?: string
}
export interface PagesRespDto extends BaseResp {
  data: PageModel[]
}
export enum LinkType {
  Friend,
  Collection,
}
export interface LinkModel extends BaseModel {
  name: string
  url: string
  avatar: string
  description?: string
  type: LinkType
}

export interface LinkRespDto extends BaseResp {
  page: PagerDto
  data: LinkModel[]
}

export interface MasterModel {
  _id: string
  introduce: string
  mail: string
  url: string
  name: string
  socialIds: {
    [name: string]: string | number
  }
  username: string
  created: string
  modified: string
  lastLoginIp: string
  lastLoginTime: Date
  avatar: string
}

export declare namespace UA {
  export interface Browser {
    name: string
    version: string
    major: string
  }

  export interface Engine {
    name: string
    version: string
  }

  export interface Os {
    name: string
    version: string
  }

  export interface Ua {
    ua: string
    browser?: Browser
    engine?: Engine
    os?: Os
  }
  export interface Root {
    _id: string
    ip?: string
    ua: Ua
    created: Date
  }
}
