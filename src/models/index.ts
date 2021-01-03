import { NoteMusicRecord } from './response.dto'

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

  mood?: string

  weather?: string
  hasMemory?: boolean

  hide?: boolean

  password?: string

  options?: Record<string, any>

  music?: NoteMusicRecord[] | undefined
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
  title: string

  text: string

  slug: string

  categoryId: string

  summary?: string

  hide?: boolean
  tags: string[]
  copyright?: boolean
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

export interface IConfig {
  seo: SEODto
  url: UrlDto
  imageBed: ImageBedDto
  mailOptions: MailOptionsDto
  commentOptions: CommentOptions
  backupOptions: BackupOptions
  baiduSearchOptions: BaiduSearchOptions
}
export declare class SEODto {
  title: string
  description: string
  icon?: string
  keywords?: string[]
}
export declare class UrlDto {
  webUrl: string
  adminUrl: string
  serverUrl: string
  wsUrl: string
}
export declare class ImageBedDto {
  type: 'github'
  token?: string
  repo?: string
  customUrl?: string
}
export declare class MailOptionsDto {
  enable: boolean
  user: string
  pass: string
  options?: {
    port: number
    host: string
  }
}
export declare class CommentOptions {
  antiSpam: boolean
  akismetApiKey?: string
}

export interface Dimensions {
  height: number
  width: number
  type: string
}
export enum FileType {
  IMAGE = 0,
  AVATAR = 1,
  BACKGROUND = 2,
  PHOTO = 3,
}
export enum FileLocate {
  Local = 0,
  Online = 1,
}

export declare class File {
  filename: string
  name: string
  mime: string
  info?: Record<string, any>
  dimensions?: Dimensions
  type: number
  locate: 0 | 1
  url?: string
}
export declare class BackupOptions {
  enable: boolean
  SecretId?: string
  SecretKey?: string
  Bucket?: string
  Region: string
}

export interface TokenModel {
  created: string

  token: string

  expired?: Date

  name: string

  id: string
}

export class BaiduSearchOptions {
  enable?: boolean

  token?: string
}
