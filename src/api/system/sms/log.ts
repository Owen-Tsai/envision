import request from '@/utils/request'

export type LogVO = {
  apiReceiveCode?: number | string
  apiReceiveMsg?: string
  apiRequestId?: number | string
  apiSendCode?: number | string
  apiSendMsg?: string
  apiSerialNo?: string
  apiTemplateId?: string
  channelCode?: string
  channelId?: number
  createTime?: number
  id?: number
  mobile?: string
  receiveStatus?: number
  receiveTime?: number
  sendCode?: number
  sendMsg?: string
  sendStatus?: number
  sendTime?: number
  templateCode?: string
  templateContent?: string
  templateId?: number
  templateParams?: Record<string, string>
  templateType?: number
  userId?: number
  userType?: number
}

export type ListQueryParams = CommonQueryParams & {
  mobile?: string
  channelId?: number
  templateCode?: string
  sendStatus?: number
  sendTime?: [string, string]
  receiveStatus?: number
  receiveTime?: [string, string]
}

export const getList = (params?: ListQueryParams) => {
  return request.get<PaginatedList<LogVO>>({
    url: '/admin-api/system/sms-log/page',
    params,
  })
}

export const getDetail = (id: number) => {
  return request.get({ url: `/admin-api/system/sms-log/get?id=${id}` })
}
