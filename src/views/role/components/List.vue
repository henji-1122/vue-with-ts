<template>
  <div class="role-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- <span>筛选搜索</span> -->
        <el-form ref="form" :model="form">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onSubmit"
              :disabled="loading"
            >查询搜索</el-button>
            <el-button
              :disabled="loading"
              @click="onReset"
            >重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-button @click="handleAdd">添加角色</el-button>
      <el-table
        :data="roles"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column
          prop="id"
          label="编号"
        />
        <el-table-column
          prop="name"
          label="角色名称"
        />
        <el-table-column
          prop="description"
          label="描述"
        />
        <el-table-column
          prop="createdTime"
          label="添加时间"
        />
        <el-table-column
          label="操作"
          align="center"
          width="150px"
        >
          <template slot-scope="scope">
            <div>
              <el-button
                type="text"
                @click="$router.push({
                  name: 'alloc-menu',
                  params: {
                    roleId: scope.row.id
                  }
                })"
              >分配菜单</el-button>
              <el-button
                type="text"
                @click="$router.push({
                  name: 'alloc-resource',
                  params: {
                    roleId: scope.row.id
                  }
                })"
              >分配资源</el-button>
            </div>
            <div>
              <el-button
                type="text"
                @click="handleEdit(scope.row)"
              >编辑</el-button>
              <el-button
                size="mini"
                type="text"
                @click="handleDelete(scope.row)"
              >删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      :title="isEdit ? '编辑角色' : '添加角色'"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <create-or-edit
      v-if="dialogVisible"
      :role-id="roleId"
      :is-edit="isEdit"
      @success="onSuccess"
      @cancel="dialogVisible = false"
      />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CreateOrEdit from './CreateOrEdit.vue'
import { getRoles, deleteRole } from '@/services/role.ts'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'RoleList',

  components: {
    CreateOrEdit
  },

  data () {
    return {
      resources: [], // 资源列表
      form: {
        current: 1,
        size: 50,
        name: ''
      },
      isEdit: false, // 默认为添加角色
      dialogVisible: false,
      roles: [],
      loading: true,
      roleId: null // 编辑角色的 ID
    }
  },

  created () {
    this.loadRoles()
  },

  methods: {
    async loadRoles () {
      const { data } = await getRoles(this.form)
      console.log(data)
      this.roles = data.data.records
      this.loading = false
    },
    handleEdit (role: any) {
      this.dialogVisible = true
      this.roleId = role.id
      this.isEdit = true
    },
    onSubmit () {
      this.loadRoles()
    },
    onReset () {
      (this.$refs.form as Form).resetFields()
      this.loadRoles()
    },
    onSuccess () {
      this.dialogVisible = false // 关闭对话框
      this.loadRoles() // 重新加载数据列表
    },
    // 添加/编辑
    handleAdd () {
      this.isEdit = false
      this.dialogVisible = true
    },
    async handleDelete (role: any) {
      try {
        await this.$confirm(`确认删除角色：${role.name}？`, '删除提示')
        await deleteRole(role.id)
        this.$message.success('删除成功')
        this.loadRoles()
      } catch (err) {
        if (err && err.response) {
          this.$message.error('删除失败，请重试')
        } else {
          this.$message.info('取消删除')
        }
      }
    }
  }
})
</script>

<style lang="scss" scoped></style>
