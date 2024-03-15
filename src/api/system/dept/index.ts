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
  deptId: number
  deptName: string
}

export type QueryParams = {
  name?: string
  status?: string
}

export type QueryParamsPage = CommonQueryParams & {
  name?: string
  status?: string
}

export function getDeptPageTree(params?: QueryParamsPage) {
  return request.get<DeptTreeListVO>({
    url: '/system/dept/tree-list-page',
    params
  })
}

export function getDeptTree(params?: QueryParams) {
  return request.get<DeptTreeNode>({
    url: '/system/dept/tree-list'
  })
}
