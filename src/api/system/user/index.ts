import request from '@/utils/request'

export type UserVO = {
  nickname?: string
  deptId?: number
  deptName?: string
  mobile?: string
  email?: string
  id?: number
  username?: string
  password?: string
  sex?: string
  status?: number
  postIds?: number[]
  roleIds?: number[]
  remark?: string
  avatar?: string
  createTime?: Date
}

export type ListQueryParams = CommonQueryParams & {
  username?: string
  nickname?: string
  mobile?: string
  status?: number
  deptId?: string | number
}

export type SimpleUserVO = Array<{
  id: number
  nickname: string
}>

export function getUsers(params?: ListQueryParams) {
  return request.get<PaginatedList<UserVO>>({
    url: '/system/user/page',
    params
  })
}

export function getUserDetail(id: number) {
  return request.get<UserVO>({
    url: `/system/user/get?id=${id}`
  })
}

export const createUser = (data: UserVO) => {
  return request.post({
    url: '/system/user/create',
    data
  })
}

export const updateUser = (data: UserVO) => {
  return request.put({
    url: '/system/user/update',
    data
  })
}

export const deleteUser = (id: number) => {
  return request.delete({
    url: `/system/user/delete?id=${id}`
  })
}

// 导出用户
// export const exportUser = (params) => {
//   return request.download({ url: '/system/user/export', params })
// }

// 下载用户导入模板
// export const importUserTemplate = () => {
//   return request.download({ url: '/system/user/get-import-template' })
// }

// 用户密码重置
export const resetUserPwd = (id: number, password: string) => {
  return request.put({
    url: '/system/user/update-password',
    data: { id, password }
  })
}

// 用户状态修改
export const updateUserStatus = (id: number, status: number) => {
  return request.put({
    url: '/system/user/update-status',
    data: { id, status }
  })
}

// 获取用户精简信息列表
export const getSimpleUserList = () => {
  return request.get<SimpleUserVO>({ url: '/system/user/simple-list' })
}
