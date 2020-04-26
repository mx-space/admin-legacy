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

export interface ProjectDto {
  _id?: string
  name: string
  previewUrl?: string
  docUrl?: string
  projectUrl?: string
  images?: string[]
  description: string
  avatar?: string
  text: string
}
export interface SayDto {
  _id?: string
  text: string
  source?: string
  author?: string
}

export interface TextOnlyDto {
  text?: string
}

export enum Mood {
  'happy' = '开心',
  'sad' = '伤心',
  'angry' = '生气',
  'sorrow' = '悲哀',
  'pain' = '痛苦',
  'terrible' = '可怕',
  'unhappy' = '不快',
  'detestable' = '可恶',
  'worry' = '担心',
  'despair' = '绝望',
  'anxiety' = '焦虑',
  'excite' = '激动',
}

export enum Weather {
  'sunshine' = '晴',
  'cloudy' = '多云',
  'rainy' = '雨',
  'overcast' = '阴',
  'snow' = '雪',
}

export type WeatherValues = keyof typeof Weather
export type MoodValues = keyof typeof Mood

export const MoodSet = Object.freeze(Object.fromEntries(Object.entries(Mood)))
export const WeatherSet = Object.freeze(
  Object.fromEntries(Object.entries(Weather)),
)
export interface NoteDto {
  title: string

  text: string

  mood?: keyof typeof Mood

  weather?: string

  hide?: boolean

  password?: string

  options?: Record<string, any>
}

export interface PageDto {
  /** Slug */
  slug: string

  /** Title */
  title: string

  /** SubTitle */
  subtitle?: string

  /** Order */
  order?: number

  /** Text */
  text: string

  /** Type (MD | html | frame) */
  type?: EnumPageType

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

export enum EnumPageType {
  'md' = 'md',
  'html' = 'html',
  'frame' = 'frame',
}
