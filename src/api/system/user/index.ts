import request from '@/utils/request'
import type { DeptVO } from '@/api/system/dept'

export type DeptTreeNode = {
  key: number
  title: string
  children?: DeptTreeNode[]
}

export type DeptTreeVO = DeptTreeNode[]

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
  phonenumber?: string
  status?: string
}

export function getDeptTree() {
  return request.get<DeptTreeVO>({
    url: '/system/user/deptTree'
  })
}

export function getUsers(params?: ListQueryParams) {
  return request.getRaw<UserListVO>({
    url: '/system/user/list',
    params
  })
}
