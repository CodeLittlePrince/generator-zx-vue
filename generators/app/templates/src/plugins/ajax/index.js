import axios from 'axios'
/**
 * axios封装
 */
const ajax = {
  get: (url, params, config) => {
    return new Promise((resolve, reject) => {
      _request('get', url, params, resolve, reject, config)
    })
  },
  post: (url, params, config) => {
    return new Promise((resolve, reject) => {
      _request('post', url, params, resolve, reject, config)
    })
  },
  dealRes: (res, resolve, reject) => {
    _dealResponse(res, resolve, reject)
  }
}

function _request(type, url, params, resolve, reject, conf) {
  const paramsProcessed = type === 'get' ? {params: params} : params
  let config = conf || {}
  // 后端数据返回格式
  // {
  //   "status": "200",
  //   "message": "some message",
  //   "result": *
  // }
  axios[type](url, paramsProcessed, config)
    .then((res) => {
      _dealResponse(res, resolve, reject)
    }).catch(err => {
      // 捕获不是ajax获取后，状态码造成的异常
      // code 999，是为了标识网络故障（已和数据员和后端商量确定）
      reject({
        text: err.response.statusText,
        code: 999
      })
    })
}

/**
 * 处理数据返回
 * @param {*} res
 * @param {*} resolve
 * @param {*} reject
 */
function _dealResponse(res, resolve, reject) {
  const data = res.data || res
  const status = data.status
  // status状态码含义
  // 200：成功
  // 401：未授权
  // 402：登陆超时
  // 403：未认证
  // 404：无数据
  // 422：数据校验失败
  // 500：程序异常

  // 后端会将错误文案放在message里面
  switch (+status) {
  case 200:
    resolve(data.result)
    break
  case 402:
    reject({
      text: data.message,
      code: status
    })
    break
  case 403:
    reject({
      text: data.message,
      code: status
    })
    break
  default:
    reject({
      text: data.message,
      code: status
    })
  }
}

// Vue 插件
ajax.install = Vue => {
  Vue.prototype.$ajax = ajax
}

export default ajax