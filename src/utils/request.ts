import { Message } from '@/plugins/message'
import router from '@/router'
import store from '@/store'
import { getToken } from '@/utils/auth'
import axios from 'axios'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  // withCredentials: true,
  timeout: 5000,
})

service.interceptors.request.use(
  (config) => {
    if (store.getters.token) {
      config.headers['Authorization'] = 'bearer ' + getToken()
    }
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
    const res = response.data

    return res
  },
  (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(error)
    }
    Message.error(error.response.data.msg || error.message)

    if (error.response.status === 401) {
      router.push('/login')
    }
    return Promise.reject(error)
  },
)

export default service
