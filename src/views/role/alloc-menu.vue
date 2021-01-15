<template>
  <div class="alloc-menu">
    <el-card>
      <div slot="header">
        <span>分配权限</span>
      </div>
      <el-tree
      ref="menu-tree"
      node-key="id"
      :data="menus"
      :props="defaultProps"
      :default-checked-keys = checkedKeys
      default-expand-all
      show-checkbox
      ></el-tree>
      <div style="text-align:center;margin-top:10px;">
        <el-button @click="resetChecked">清空</el-button>
        <el-button type="primary" @click="onSave">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getMenuNodeList, allocateRoleMenus, getRoleMenus } from '@/services/menu.ts'
import { Tree } from 'element-ui'

export default Vue.extend({
  name: 'AllocMenu',
  props: {
    roleId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      menus: [],
      defaultProps: {
        children: 'subMenuList',
        label: 'name'
      },
      checkedKeys: [] // 选中的id数组
    }
  },
  created () {
    this.loadMenus()
    this.loadRoleMenus()
  },
  methods: {
    // 获取所有菜单并按层级展示
    async loadMenus () {
      const { data } = await getMenuNodeList()
      this.menus = data.data
    },

    // 获取角色拥有的菜单列表
    async loadRoleMenus () {
      const { data } = await getRoleMenus(this.roleId)
      // console.log(data)
      this.getCheckedKeys(data.data)
    },

    // 获取菜单列表默认选中的id
    getCheckedKeys (menus: any) {
      menus.forEach((menu: any) => {
        if (menu.selected) {
          // this.checkedKeys.push(menus.id as never)
          this.checkedKeys = [...this.checkedKeys, menu.id] as any
        }
        if (menus.subMenuList) {
          this.getCheckedKeys(menus.subMenuList)
        }
      })
    },

    // 清空选中
    resetChecked () {
      (this.$refs['menu-tree'] as Tree).setCheckedKeys([])
    },

    // 保存
    async onSave () {
      // 拿到选中的节点数据id列表
      // 请求提交保存
      const menuIdList = (this.$refs['menu-tree'] as Tree).getCheckedKeys() // ElementUi方法
      console.log(menuIdList)
      await allocateRoleMenus({
        roleId: this.roleId,
        menuIdList
      })
      this.$message.success('操作成功')
      this.$router.back()
    }
  }
})
</script>

<style lang="scss" scoped></style>
