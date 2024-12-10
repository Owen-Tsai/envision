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

const prefix = '/admin-api/system/role'

export const getSimpleList = () => {
  return request.get<RoleVO[]>({
    url: `${prefix}/simple-list`
  })
}

export const getSimpleAuditList = () => {
  return request.get<RoleVO[]>({
    url: `${prefix}/list-all-simple-audit`
  })
}

export const getRolesList = (params?: CommonQueryParams) => {
  return request.get<PaginatedList<RoleVO>>({
    url: `${prefix}/page`,
    params
  })
}

export const getRoleDetail = (id: number) => {
  return request.get<RoleVO>({
    url: `${prefix}/get?id=${id}`
  })
}

export const addRole = (data: RoleVO) => {
  return request.post({
    url: `${prefix}/create`,
    data
  })
}

export const updateRole = (data: RoleVO) => {
  return request.put({
    url: `${prefix}/update`,
    data
  })
}

export const deleteRole = (id: number) => {
  return request.delete({
    url: `${prefix}/delete?id=${id}`
  })
}

export const getRoleSimpleList = () => {
  return request.get<Pick<RoleVO, 'id' | 'name'>[]>({
    url: `${prefix}/simple-list`
  })
}
