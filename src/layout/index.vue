<template>
  <el-container>
    <el-aside width="200px">
      <app-aside />
    </el-aside>
    <el-container>
      <el-header>
        <app-header />
      </el-header>
      <router-view />
    </el-container>
  </el-container>
</template>

<script lang="ts">
import Vue from 'vue'
import appAside from './components/app-aside.vue' // 侧边栏组件
import appHeader from './components/app-header.vue' // 头部组件

export default Vue.extend({
  name: 'layoutIndex',

  components: {
    appAside,
    appHeader
  }
})
</script>

<style lang="scss" scoped>
.el-container {
  min-height: 100vh;
  min-width: 980px;
}

.el-aside {
  position: sticky;
  top: 0;
  max-height: 100vh;
  background: #d3dce6;
}

.el-header {
  background: #f8f9fb;
  display:flex;
  align-items: center;
}

.el-main {
  background: #e9eef3;
}
</style>
