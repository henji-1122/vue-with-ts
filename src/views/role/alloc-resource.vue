<template>
  <div class="alloc-resource">
    <el-card>
      <div slot="header">
        <span>分配资源</span>
      </div>
      <el-tree
      ref="resource-tree"
      node-key="id"
      :data="resources"
      :props="defaultProps"
      :default-checked-keys = "defaultCheckedKeys"
      :default-expanded-keys="defaultCheckedKeys"
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
import { getAllResources, getRoleResources, allocateRoleResources } from '@/services/resource.ts'
import { getResourceCategories } from '@/services/resource-category.ts'
import { Tree } from 'element-ui'

export default Vue.extend({
  name: 'AllocResource',
  props: {
    roleId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      resources: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      defaultCheckedKeys: [] // 选中的id数组
    }
  },
  created () {
    this.loadResources()
    this.loadRoleResources()
  },
  methods: {
    // 获取所有菜单并按层级展示
    async loadResources () {
      const ret = await Promise.all([getAllResources(), getResourceCategories()])
      const resources = ret[0].data.data
      const resourceCategories = ret[1].data.data

      // 获取菜单列表默认选中的id
      resources.forEach((r: any) => {
        const category = resourceCategories.find((c: any) => c.id === r.categoryId)
        if (category) {
          category.children = category.children || []
          category.children.push(r)
        }
      })
      // 修改顶层分类 ID：因为分类 ID 和资源 ID 冲突
      resourceCategories.forEach((item: any) => {
        item.id = Math.random()
      })

      this.resources = resourceCategories
    },

    // 获取角色拥有的资源列表
    async loadRoleResources () {
      const { data } = await getRoleResources(this.roleId)
      console.log(data)
      this.getCheckedResources(data.data)
    },
    getCheckedResources (resources: any) {
      resources.forEach((r: any) => {
        r.resourceList && r.resourceList.forEach((c: any) => {
          if (c.selected) {
            this.defaultCheckedKeys = [...this.defaultCheckedKeys, c.id] as any
          }
        })
      })
    },

    // 清空选中
    resetChecked () {
      (this.$refs['resource-tree'] as Tree).setCheckedKeys([])
    },

    // 保存
    async onSave () {
      // 拿到选中的节点数据id列表
      // 请求提交保存
      const checkedNodes = (this.$refs['resource-tree'] as Tree).getCheckedNodes() // ElementUi方法
      console.log(checkedNodes)
      const resourceIdList: number[] = []
      checkedNodes.forEach(item => {
        if (!item.children) {
          resourceIdList.push(item.id)
        }
      })
      await allocateRoleResources({
        roleId: this.roleId,
        resourceIdList
      })
      this.$message.success('保存成功')
      this.$router.back()
    }
  }
})
</script>

<style lang="scss" scoped></style>
