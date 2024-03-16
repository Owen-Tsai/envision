import request from '@/utils/request'
import type { Dayjs } from 'dayjs'

export type UserVO = {
  userId: number
  username: string
  status: number
  sex?: string
  remark?: string
  id?: number
  email?: string
  nickname?: string
  mobile?: string
  createTime?: string
}

export type UserListVO = {
  list: Array<UserVO>
  total: number
}

export type ListQueryParams = CommonQueryParams & {
  userName?: string
  nickName?: string
  mobile?: string
  status?: number
  deptId?: string
  createTime?: [string, string] | [Dayjs, Dayjs]
}

export type UserDTO = {
  nickname?: string
  deptId?: number
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
}

export function getUsers(params?: ListQueryParams) {
  return request.get<UserListVO>({
    url: '/system/user/page',
    params
  })
}

export function getUserDetail(id: number) {
  return request.get<UserVO>({
    url: `/system/user/get?id=${id}`
  })
}

export const createUser = (data: UserDTO) => {
  return request.post({
    url: '/system/user/create',
    data
  })
}

export const updateUser = (data: UserDTO) => {
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
export const getSimpleUserList = (): Promise<UserVO[]> => {
  return request.get({ url: '/system/user/simple-list' })
}
