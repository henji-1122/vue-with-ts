/* 菜单相关请求模块 */

import request from '@/utils/request'

// 添加菜单
export const createOrUpdateMenu = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/menu/saveOrUpdate',
    data
  })
}

// 编辑菜单
export const getEditMenuInfo = (id: string | number = -1) => { // id是联合类型，form中的id是数字类型，编辑时地址栏中的参数是字符串
  return request({
    method: 'GET',
    url: '/boss/menu/getEditMenuInfo',
    params: {
      id
    }
  })
}

// 获取所有菜单
export const getAllMenus = () => {
  return request({
    method: 'GET',
    url: '/boss/menu/getAll'
  })
}

// 删除菜单
export const deleteMenu = (id: number) => {
  return request({
    method: 'DELETE',
    url: `/boss/menu/${id}`
  })
}

// 获取所有菜单并按层级展示
export const getMenuNodeList = () => {
  return request({
    method: 'GET',
    url: '/boss/menu/getMenuNodeList'
  })
}

// 给角色分配菜单
export const allocateRoleMenus = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/menu/allocateRoleMenus',
    data
  })
}

// 获取角色拥有的菜单列表
export const getRoleMenus = (roleId: string | number) => {
  return request({
    method: 'GET',
    // url: '/boss/menu/getRoleMenus?roleId=' + roleId
    url: '/boss/menu/getRoleMenus',
    params: { // axios会把params转换为key=value&key=value的数据格式，放到url后面(以？分割)
      roleId
    }
  })
}
