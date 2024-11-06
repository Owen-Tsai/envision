import request from '@/utils/request'

export type RoleVO = {
  id?: number
  name?: string
  code?: string
  createTime?: number
  dataScope?: number
  // ??
  dataScopeDeptIds?: any
  sort?: number
  status?: number
  remark?: string
}

export type ListQueryParams = CommonQueryParams & {
  code?: string
  name?: string
  status?: number
}

export const getSimpleList = () => {
  return request.get<RoleVO[]>({
    url: 'system/role/simple-list'
  })
}

export const getSimpleAuditList = () => {
  return request.get<RoleVO[]>({
    url: '/system/role/list-all-simple-audit'
  })
}

export const getRolesList = (params?: CommonQueryParams) => {
  return request.get<PaginatedList<RoleVO>>({
    url: '/system/role/page',
    params
  })
}

export const getRoleDetail = (id: number) => {
  return request.get<RoleVO>({
    url: `/system/role/get?id=${id}`
  })
}

export const addRole = (data: RoleVO) => {
  return request.post({
    url: '/system/role/create',
    data
  })
}

export const updateRole = (data: RoleVO) => {
  return request.put({
    url: '/system/role/update',
    data
  })
}

export const deleteRole = (id: number) => {
  return request.delete({
    url: `/system/role/delete?id=${id}`
  })
}

export const getRoleSimpleList = () => {
  return request.get<Pick<RoleVO, 'id' | 'name'>[]>({
    url: '/system/role/simple-list'
  })
}
