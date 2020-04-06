export interface UserDto {
  username?: string

  password?: string

  mail?: string

  name?: string

  url?: string
}

export interface LoginDto {
  username?: string

  password?: string
}

export interface UserPatchDto {
  username?: string

  password?: string

  mail?: string

  name?: string

  url?: string

  apiToken?: string[]
}

export interface CategoryDto {
  name?: string

  type?: EnumCategoryDtoType

  slug?: string
}

export interface CommentDto {
  author?: string

  text?: string

  mail?: string

  url?: string
}

export interface TextOnlyDto {
  text?: string
}

export interface NoteDto {
  title?: string

  text?: string

  mood?: EnumNoteDtoMood

  weather?: string

  hide?: boolean

  password?: string
}

export interface Page {
  /** Slug */
  slug?: string

  /** Title */
  title?: string

  /** SubTitle */
  subtitle?: string

  /** Order */
  order?: number

  /** Text */
  text?: string

  /** Type (MD | html | frame) */
  type?: EnumPageType

  /** 留言 */
  messages?: string[]

  /** Other Options */
  options?: object
}

export interface PostDto {
  title?: string

  text?: string

  slug?: string

  categoryId?: string

  summary?: string

  hide?: boolean

  options?: object
}
export enum EnumCategoryDtoType {
  'Category' = 'Category',
  'Tag' = 'Tag',
}
export enum EnumNoteDtoMood {
  '开心' = '开心',
  '伤心' = '伤心',
}
export enum EnumPageType {
  'md' = 'md',
  'html' = 'html',
  'frame' = 'frame',
}
