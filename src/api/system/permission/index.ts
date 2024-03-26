import request from '@/utils/request'

export type RolePermissionVO = {
  roleId?: number
  menuIds?: number[]
  dataScope?: number
  dataScopeDeptIds?: number[]
}

export const setUserRole = (uid: number, rid: number[]) => {
  return request.post({
    url: '/system/permission/assign-user-role',
    data: {
      userId: uid,
      roleIds: rid
    }
  })
}

export const getUserRoles = (id: number) => {
  return request.get<number[]>({
    url: `/system/permission/list-user-roles?userId=${id}`
  })
}

export const getRoleMenuList = (id: number) => {
  return request.get<number[]>({ url: `/system/permission/list-role-menus?roleId=${id}` })
}

export const setRoleMenuList = (data: RolePermissionVO) => {
  return request.post({
    url: '/system/permission/assign-role-menu',
    data
  })
}

export const setRoleDataScope = (data: RolePermissionVO) => {
  return request.post({
    url: '/system/permission/assign-role-data-scope',
    data
  })
}
