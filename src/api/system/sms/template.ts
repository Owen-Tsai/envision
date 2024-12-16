import request from '@/utils/request'

export type TemplateVO = {
  id?: number
  // todo: ?
  apiTemplateId?: string
  channelCode?: string
  channelId?: number
  code?: string
  content?: string
  createTime?: string
  name?: string
  params?: Array<string>
  remark?: string
  status?: number
  type?: number
}

export type ListQueryParams = CommonQueryParams & {
  name?: string
  type?: number
  code?: string
  status?: number
  channelId?: number
}

const prefix = '/admin-api/system/sms-template'

export const getTemplateList = (params?: ListQueryParams) => {
  return request.get<PaginatedList<TemplateVO>>({
    url: `${prefix}/page`,
    params,
  })
}

export const getSimpleTemplateList = () => {
  return request.get({ url: `${prefix}/simple-list` })
}

export const getTemplateDetail = (id: number) => {
  return request.get({ url: `${prefix}/get?id=${id}` })
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
  return request.delete({ url: `${prefix}/get?id=${id}` })
}
