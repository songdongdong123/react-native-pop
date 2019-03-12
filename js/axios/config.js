import axios from 'axios'
// import { Toast } from 'antd-mobile'
import qs from 'qs'
// import { getBaseUrl } from './common/util'

// 拦截请求
let config = {
  baseURL: 'https://api.ethansblogs.com', //可根据实际情况配置
  withCredentials: true,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  timeout: 10000,
  transformRequest: [function (data) {
    // 处理发送前的数据
    data = qs.stringify(data)
    return data
  }],
  data: {
    // 全局参数
  }
}

// 全局拦截请求
axios.interceptors.request.use((data) => {
  return data;
})

// 全局拦截相应
axios.interceptors.response.use((data) => {
  return data;
})

const get = (url, params) => {
  url = urlEncode(url, params)
  return axios.get(url, config)
}

const post = (url, params, con) => {
  return axios.post(url, params, config)
}

// 用来拼接get请求的时候的参数
let urlEncode = (url, data) => {
  if (typeof (url) === 'undefined' || url === null || url === '') return ''
  if (typeof (data) === 'undefined' || data === null || typeof (data) !== 'object') return url
  url += (url.indexOf('?') !== -1) ? '' : '?'
  for (let k in data) {
    url += ((url.indexOf('=') !== -1) ? '&' : '') + k + '=' + encodeURI(data[k])
  }
  return url
}

export {
  get,
  post
}