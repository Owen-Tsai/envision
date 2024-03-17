import request from '@/utils/request'

export type UserRoleDTO = {
  roleIds: number[]
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
