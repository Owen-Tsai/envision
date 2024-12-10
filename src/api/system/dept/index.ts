import request from '@/utils/request'

export type DeptTreeNode = {
  key: number
  title: string
  children?: DeptTreeNode[]
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

const prefix = '/system/dept'

export const getDeptTree = (params?: TreeQueryParams) => {
  return request.get<DeptTreeVO>({
    url: `${prefix}/tree-list`,
    params
  })
}

export const getDeptDetail = (id: number) => {
  return request.get<DeptVO>({
    url: `${prefix}/get?id=${id}`
  })
}

export const createDept = (data: DeptVO) => {
  return request.post({
    url: `${prefix}/create`,
    data
  })
}

export const updateDept = (data: DeptVO) => {
  return request.put({
    url: `${prefix}/update`,
    data
  })
}

export const deleteDept = (id: number) => {
  return request.delete({
    url: `${prefix}/delete?id=${id}`
  })
}

export const getDeptSimpleList = () => {
  return request.get<Array<{ id: number; name: string }>>({
    url: `${prefix}/simple-list`
  })
}
