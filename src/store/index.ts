import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // JSON.parse()要求接收的是string类型的参数
    // window.localStorage.getItem('user')返回的是string或者null类型，是联合类型，不能赋值给单类型，类型不符合要求时编辑器会有提示
    // 所以如果读取到就赋值为字符串，读不到就赋值为null类型
    user: JSON.parse(window.localStorage.getItem('user') || 'null') // 当前用户登录状态
  },
  mutations: {
    setUser (state, payload) { // payload:用户传递的参数
      state.user = JSON.parse(payload)

      // 将user用户数据持久化
      window.localStorage.setItem('user', payload) // 注意：本地存储只能存储字符串
    }
  },
  actions: {
  },
  modules: {
  }
})
