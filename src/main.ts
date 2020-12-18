import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui' // 核心组件库
// import 'element-ui/lib/theme-chalk/index.css' 全局样式index.scss中已加载

// 加载全局样式
import './styles/index.scss'

Vue.use(ElementUI)

Vue.config.productionTip = false // 关闭生产环境提示

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
