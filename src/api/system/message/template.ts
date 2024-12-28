import request from '@/utils/request'

export type TemplateVO = {
  id?: number
  code?: string
  name?: string
  content?: string
  createTime?: number
  nickname?: string
  params?: Array<string>
  remark?: string
  status?: number
  type?: number
}

export type ListQueryParams = CommonQueryParams & {
  name?: string
  code?: string
  status?: number
  type?: number
}

const prefix = '/admin-api/system/notify-template'

export const getTemplateList = (params: ListQueryParams) => {
  return request.get<PaginatedList<TemplateVO>>({
    url: `${prefix}/page`,
    params,
  })
}

export const getTemplateDetail = (id: number) => {
  return request.get<TemplateVO>({
    url: `${prefix}/get?id=${id}`,
  })
}

export const addTemplate = (data: TemplateVO) => {
  return request.post({
    url: `${prefix}/create`,
    data,
  })
}

export const updateTemplate = (data: TemplateVO) => {
  return request.put({
    url: `${prefix}/update`,
    data,
  })
}

export const deleteTemplate = (id: number) => {
  return request.delete<TemplateVO>({
    url: `${prefix}/delete?id=${id}`,
  })
}
