import $axios from '@/utils/request'
import { AxiosRequestConfig } from 'axios'
import inflection from 'inflection'

declare enum AccessRoutesEnum {
  Aggregate,
  Auth,
  Analyze,
  Backup,
  Category,
  Comment,
  Link,
  Master,
  Menu,
  Note,
  Option,
  Page,
  Post,
  Project,
  Say,
  Upload,
}

interface Gets {
  page?: number
  size?: number
  select?: string
  state?: number
}

export const rest = (rest: keyof typeof AccessRoutesEnum, prefix?: string) => {
  let pluralize = ['Master', 'Menu', 'Aggregate', 'Analyze', 'Auth'].includes(
    rest,
  )
    ? rest.toLowerCase()
    : inflection.pluralize(rest).toLowerCase()
  pluralize = prefix ? pluralize + `/${prefix}` : pluralize
  pluralize = encodeURI(pluralize)
  const apis = {
    async getRecently<T = unknown>(
      { page, size, select, state }: Gets = {},
      params: Record<string, any> = {},
    ): Promise<T> {
      const data = await $axios({
        method: 'GET',
        url: `/${pluralize}`,
        params: {
          page: page || 1,
          size: size || 10,
          select,
          state,
          ...params,
        },
      })
      return data as any
    },
    async getOne<T = unknown>(
      _id = '',
      config?: AxiosRequestConfig,
    ): Promise<T> {
      const id = encodeURI(_id)
      const data = await $axios.get(`${pluralize}${id ? '/' + id : ''}`, config)
      return data as any
    },
    async postNew<T = unknown, U = any>(
      body: T,
      config?: AxiosRequestConfig,
    ): Promise<U> {
      const data = await $axios.post(`${pluralize}`, body, config)
      return data as any
    },
    async modifyOne<T = unknown, U = any>(id: string, body: T): Promise<U> {
      const data = await $axios.put(`${pluralize}/${id}`, body)
      return data as any
    },
    async deleteOne<T = unknown>(
      id?: string,
      config?: AxiosRequestConfig,
    ): Promise<T> {
      const data = await $axios.delete(
        `${pluralize}${id ? '/' + id : ''}`,
        config,
      )
      return data as any
    },
    get gets() {
      return this.getRecently
    },
    get get() {
      return this.getOne
    },
    get post() {
      return this.postNew
    },
    get update() {
      return this.modifyOne
    },
    async patch<T = unknown, U = any>({
      id,
      body,
    }: {
      id?: string
      body?: U
    }): Promise<U> {
      const data = await $axios({
        url: id ? `${pluralize}/${id}` : pluralize,
        method: 'patch',
        data: body,
      })
      return data as any
    },
    get del() {
      return this.deleteOne
    },
    get delete() {
      return this.deleteOne
    },
    get api() {
      return (path: string, rest: AxiosRequestConfig) =>
        $axios.request({ url: pluralize + '/' + path, ...rest })
    },
  }
  return apis
}

export default $axios
