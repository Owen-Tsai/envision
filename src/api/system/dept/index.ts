import request from '@/utils/request'

export type DeptTreeNode = {
  key: number
  title: string
  children?: DeptTreeNode[]
}
export type DeptTreeListVO = {
  list: Array<DeptTreeNode>
  total: number
}
export type DeptTreeVO = DeptTreeNode[]

export type DeptVO = {
  createTime?: number
  email?: string
  id?: number
  leaderUserId?: number
  name?: string
  parentId?: number
  phone?: string
  sort?: number
  status?: number
}

export type TreeQueryParams = {
  name?: string
  status?: number
  leaderUserId?: number
}

export const getDeptTree = (params?: TreeQueryParams) => {
  return request.get<DeptTreeVO>({
    url: '/system/dept/tree-list',
    params
  })
}

export const getDeptDetail = (id: number) => {
  return request.get<DeptVO>({
    url: `/system/dept/get?id=${id}`
  })
}

export const createDept = (data: DeptVO) => {
  return request.post({
    url: '/system/dept/create',
    data
  })
}

export const updateDept = (data: DeptVO) => {
  return request.put({
    url: '/system/dept/update',
    data
  })
}

export const deleteDept = (id: number) => {
  return request.delete({
    url: `/system/dept/delete?id=${id}`
  })
}
