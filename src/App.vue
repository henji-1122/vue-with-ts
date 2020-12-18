<template>
  <div id="app">
    <h1>虫虫</h1>
    <!-- 跟路由的出口 -->
    <router-view/>
    <p class="text">hello world</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
// import request from '@/utils/request'

// request({
//   method: 'GET',
//   url: '/boss'
// }).then( res => {
//   console.log(res)
// })

export default Vue.extend({
  name: 'App'
})

</script>

<style lang="scss" scoped>
// @import "~@/styles/variables.scss"; 已在vue.config.js文件中配置

.text{
  color:$warning-color
}
</style>
