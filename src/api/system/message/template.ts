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

export const getTemplateList = (params: ListQueryParams) => {
  return request.get<PaginatedList<TemplateVO>>({
    url: '/system/notify-template/page',
    params
  })
}

export const getTemplateDetail = (id: number) => {
  return request.get<TemplateVO>({
    url: `/system/notify-template/get?id=${id}`
  })
}

export const addTemplate = (data: TemplateVO) => {
  return request.post({
    url: '/system/notify-template/create',
    data
  })
}

export const updateTemplate = (data: TemplateVO) => {
  return request.put({
    url: '/system/notify-template/update',
    data
  })
}

export const deleteTemplate = (id: number) => {
  return request.delete<TemplateVO>({
    url: `/system/notify-template/delete?id=${id}`
  })
}
