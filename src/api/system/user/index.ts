import request from '@/utils/request'
import type { Dayjs } from 'dayjs'

export type UserVO = {
  userId: number
  username: string
  status: string
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
  status?: string
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
  status?: string
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
