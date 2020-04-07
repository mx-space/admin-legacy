import $axios from '@/utils/request'
import inflection from 'inflection'

export enum AccessRoutesEnum {
  Post,
  Category,
  Comment,
  Note,
  Page,
  Master,
  Menu,
}

export const rest = (rest: keyof typeof AccessRoutesEnum, prefix?: string) => {
  let pluralize = ['Master', 'Menu'].includes(rest)
    ? rest.toLowerCase()
    : inflection.pluralize(rest).toLowerCase()
  pluralize = prefix ? pluralize + `/${prefix}` : pluralize
  const apis = {
    async getRecently({ page = 1, size = 10 } = {}) {
      const data = await $axios({
        method: 'GET',
        url: `/${pluralize}`,
        params: {
          page,
          size,
        },
      })
      return data
    },
    async getOne(id: string) {
      const data = await $axios.get(`${pluralize}/${id}`)
      return data
    },
    async postNew(body: Record<string, any>) {
      const data = await $axios.post(`${pluralize}`, body)
      return data
    },
    async modifyOne(id: string, body: Record<string, any>) {
      const data = await $axios.put(`${pluralize}/${id}`, body)
      return data
    },
    async deleteOne(id: string) {
      const data = await $axios.delete(`${pluralize}/${id}`)
      return data
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
    get del() {
      return this.deleteOne
    },
    get delete() {
      return this.deleteOne
    },
  }
  return apis
}
