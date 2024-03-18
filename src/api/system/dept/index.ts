import request from '@/utils/request'

export type DeptTreeNode = {
  key: number
  title: string
  children?: DeptTreeNode[]
}

export type DeptTreeVO = DeptTreeNode[]

type Dept = {
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

export type DeptDTO = Dept

export const getDeptTree = (params?: TreeQueryParams) => {
  return request.get<DeptTreeVO>({
    url: '/system/dept/tree-list',
    params
  })
}

export const getDeptDetail = (id: number) => {
  return request.get<Dept>({
    url: `/system/dept/get?id=${id}`
  })
}

export const createDept = (data: DeptDTO) => {
  return request.post({
    url: '/system/dept/create',
    data
  })
}

export const updateDept = (data: DeptDTO) => {
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
