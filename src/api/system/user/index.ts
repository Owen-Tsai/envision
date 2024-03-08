import request from '@/utils/request'
import type { DeptVO } from '@/api/system/dept'

export type DeptTreeNode = {
  key: number
  title: string
  children?: DeptTreeNode[]
}

// export type DeptTreeVO = DeptTreeNode[]
export type DeptTreeVO = Array<{
  id: number
  name: string
  parentId: number
}>

export type UserListVO = {
  rows: Array<{
    userId: number
    userName: string
    status: string
    sex?: string
    remark?: string
    deptId?: number
    email?: string
    nickName?: string
    phonenumber?: string
    dept: DeptVO
    createTime?: string
  }>
}

export type ListQueryParams = CommonQueryParams & {
  userName?: string
  nickName?: string
  phonenumber?: string
  status?: string
  deptId?: string
}

export type UserDTO = {
  nickName?: string
  deptId?: number
  phonenumber?: string
  email?: string
  userId?: number
  userName?: string
  password?: string
  sex?: string
  status?: string
  postIds?: number[]
  roleIds?: number[]
  remark?: string
}

export function getDeptTree() {
  return request.get<DeptTreeVO>({
    url: '/system/dept/simple-list'
  })
}

export function getUsers(params?: ListQueryParams) {
  return request.getRaw<UserListVO>({
    url: '/system/user/list',
    params
  })
}
