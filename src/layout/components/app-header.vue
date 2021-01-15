<template>
  <div class="header">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{$route.meta.title}}</el-breadcrumb-item>
    </el-breadcrumb>

    <el-dropdown>
      <span class="el-dropdown-link">
        <el-avatar
          shape="square"
          :size="30"
          :src="userInfo.portrait || require('@/assets/default-avatar.png')"
        >
        </el-avatar>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>{{userInfo.userName}}</el-dropdown-item>
        <el-dropdown-item divided @click.native="handleLogOut">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import Vue from 'vue'
import { getUserInfo } from '@/services/user'

export default Vue.extend({
  name: 'AppHeader',

  data () {
    return {
      userInfo: {}, // 当前登录用户信息
      routeName: ''
    }
  },

  created () { // 不建议在此处直接写逻辑，而是封装成一个个方法
    this.loadUserInfo()
    this.loadUserInfo()
  },

  methods: {
    async loadUserInfo () {
      const { data } = await getUserInfo() // 返回401是coken过期，重新登录即可
      // console.log(data)
      this.userInfo = data.content
      console.log('loadUserInfo')
    },

    handleLogOut () {
      // console.log('退出登录')
      this.$confirm('确认退出吗?', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // 确认 执行这里
        // 清除登录状态
        this.$store.commit('setUser', null)

        // 跳转到登录页
        this.$router.push({
          name: 'login'
        })
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
      }).catch(() => { // 取消执行这里
        this.$message({
          type: 'info',
          message: '取消退出'
        })
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .el-dropdown-link {
    display: flex;
    align-items: center;
  }
}
</style>
