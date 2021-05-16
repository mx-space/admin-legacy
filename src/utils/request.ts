/*
 * @Author: Innei
 * @Date: 2020-04-21 16:05:54
 * @LastEditTime: 2020-07-12 10:58:50
 * @LastEditors: Innei
 * @FilePath: /mx-admin/src/utils/request.ts
 * @Coding with Love
 */

import { Message } from 'kico-message'
import router from '@/router'
import store from '@/store'
import { getToken } from '@/utils/auth'
import axios from 'axios'
import camelcaseKeys from 'camelcase-keys'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API || 'http://localhost:2333',
  timeout: 5000,
})

service.interceptors.request.use(
  (config) => {
    if (store.getters.token) {
      config.headers['Authorization'] = 'bearer ' + getToken()
    }
    config.url += '?timestamp=' + new Date().getTime()
    return config
  },
  (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(error)
    }
    return Promise.reject(error)
  },
)

service.interceptors.response.use(
  (response) => {
    const res = camelcaseKeys(response.data, { deep: true })

    return res
  },
  (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(error)
    }
    try {
      Message.error(
        error.response.data.message || error.response.data.msg || error.message,
      )
    } catch {
      Message.error('出错了, 请查看控制台')
    }

    if (error?.response?.status === 401) {
      router.push('/login')
    }
    return Promise.reject(error)
  },
)

export default service
