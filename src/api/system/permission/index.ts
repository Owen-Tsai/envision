import request from '@/utils/request'

export type RolePermissionVO = {
  roleId?: number
  menuIds?: number[]
  dataScope?: number
  dataScopeDeptIds?: number[]
}

const prefix = '/system/permission/'

export const setUserRole = (uid: number, rid: number[]) => {
  return request.post({
    url: `${prefix}/assign-user-role`,
    data: {
      userId: uid,
      roleIds: rid
    }
  })
}

export const getUserRoles = (id: number) => {
  return request.get<number[]>({
    url: `${prefix}/list-user-roles?userId=${id}`
  })
}

export const getRoleMenuList = (id: number) => {
  return request.get<number[]>({
    url: `${prefix}/list-role-menus?roleId=${id}`
  })
}

export const setRoleMenuList = (data: RolePermissionVO) => {
  return request.post({
    url: `${prefix}/assign-role-menu`,
    data
  })
}

export const setRoleDataScope = (data: RolePermissionVO) => {
  return request.post({
    url: `${prefix}/assign-role-data-scope`,
    data
  })
}
