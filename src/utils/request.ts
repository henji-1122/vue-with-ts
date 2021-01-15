// 封装请求模块
import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import qs from 'qs'
import router from '@/router' // 这里得到的router跟组件中使用的this.$router是同一个东西，路由里面创建的路由实例

const request = axios.create({
  // 配置选项
  // baseURL,
  // timeout
})

// 请求拦截器：只要有请求都会经过这里
request.interceptors.request.use(function (config) {
  // config配置对象:存放本次请求的相关数据(请求头、数据data、本次请求的method、本次请求的url地址等等，都在这个config配置对象中)
  // console.log('接口请求进来了', config)
  // 在这里通过改写config配置信息来实现业务功能的统一处理
  const { user } = store.state
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }

  // 注意：这里一定要返回config，否则请求就发不出去了
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// 登录方法
function redirectLogin () {
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

// 刷新token方法
function refreshToken () {
  // 注意：这里不能使用request去发请求，因为有可能还会失败返回401，就又会回到这里刷新teken，又失败进入到请求拦截器再次发请求，再返回401...
  // 所以采用axios.create()方法重新创建axios请求实例，这样就跟request拦截器不是同一个实例
  return axios.create()({
    method: 'POST',
    url: '/front/user/refresh_token',
    data: qs.stringify({
      // refresh_token 只能使用1次
      refreshtoken: store.state.user.refresh_token
    })
  })
}

// 响应拦截器
let isReFreshing = false // 用来控制刷新token的状态
let requests: any[] = [] // 存储刷新token期间过来的401请求
request.interceptors.response.use(function (response) { // 响应成功(状态码为2xx都会进入这里)
  // console.log('响应成功了 =>', response)
  // 如果是自定义错误状态码，错误处理就写到这里
  return response
}, async function (error) { // 响应失败(超出2xx状态码都会执行这里)
  // console.log('响应失败了 =>', error)
  // console.dir(error) // 拿到响应失败的完整信息
  // 如果是使用的HTTP状态码，错误处理就写到这里
  if (error.response) { // 请求发出去收到响应了，但是状态码超出了2xx范围
    const { status } = error.response
    if (status === 400) {
      Message.error('请求参数错误')
    } else if (status === 401) {
      // token无效：没有提供token | token是无效的 | token过期了
      // 如果有refresh_token则尝试使用refresh_token获取新的access_token
      if (!store.state.user) {
        redirectLogin()
        return Promise.reject(error)
      }
      // 刷新token
      if (!isReFreshing) { // 如果没有在刷新token
        isReFreshing = true // 开启刷新token状态
        // 尝试刷新获取新的token
        return refreshToken().then(res => {
          // 刷新获取新的token失败
          if (!res.data.success) {
            throw new Error('刷新token失败') // 进入下面的catch处理
          }
          // 刷新获取新的token成功 -> 把本次失效的请求重新发出去
          // 把刷新拿到的新access_token更新到容器和本地存储中
          store.commit('setUser', res.data.content)
          // 把requests队列中本次失败的请求重新发出去
          requests.forEach(cb => cb())
          // 重置 requests 数组
          requests = []
          // console.log(error.config) // 失败请求的配置信息(url，query，data等)
          return request(error.config) // 将返回的Promise返回出去，真正发请求的地方才能拿到数据
        }).catch(err => {
          console.log(err)
          // 失败了 -> 跳转登录页重新登录获取新的token
          // 将当前登录用户信息清除
          store.commit('setUser', null)
          redirectLogin()
          return Promise.reject(error)
        }).finally(() => {
          isReFreshing = false // 重置刷新状态
        })
        // 如果没有refresh_token，则直接跳转登录页
      }

      // 刷新状态下，把请求挂起放到requsts数组中
      return new Promise(resolve => { // 挂起：不执行resolve的promise，promise不处理请求就会一直等待
        requests.push(() => {
          resolve(request(error.config))
        })
      })
    } else if (status === 403) {
      Message.error('没有权限，请联系管理员')
    } else if (status === 404) {
      Message.error('请求资源不存在')
    } else if (status >= 500) {
      Message.error('服务端错误，请联系管理员')
    }
  } else if (error.request) { // 请求发出去没有收到响应(网络超时或者网络断开了等)
    Message.error('请求超时，请刷新重试')
  } else { // 在设置请求时发生了一些事情，触发了一个错误
    Message.error(`请求失败：${error.message}`)
  }
  // 把请求失败的错误对象继续抛出，扔给上一个调用者
  return Promise.reject(error)
})

export default request
