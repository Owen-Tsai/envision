import request from '@/utils/request'

export type DeptTreeNode = {
  key: number
  title: string
  children?: DeptTreeNode[]
}

export type DeptTreeVO = DeptTreeNode[]

export type DeptVO = {
  deptId: number
  deptName: string
}

export function getDeptTree() {
  return request.get<DeptTreeVO>({
    url: '/system/dept/tree-list'
  })
}
