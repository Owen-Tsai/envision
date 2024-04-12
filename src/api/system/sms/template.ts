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

export const getTemplateList = (params?: ListQueryParams) => {
  return request.get<PaginatedList<TemplateVO>>({
    url: '/system/sms-template/page',
    params
  })
}

export const getSimpleTemplateList = () => {
  return request.get({ url: '/system/sms-template/simple-list' })
}

export const getTemplateDetail = (id: number) => {
  return request.get({ url: `/system/sms-template/get?id=${id}` })
}

export const addTemplate = (data: TemplateVO) => {
  return request.post({
    url: '/system/sms-template/create',
    data
  })
}

export const updateTemplate = (data: TemplateVO) => {
  return request.put({
    url: '/system/sms-template/update',
    data
  })
}

export const deleteTemplate = (id: number) => {
  return request.delete({ url: `/system/sms-template/get?id=${id}` })
}
