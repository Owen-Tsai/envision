import request from '@/utils/request'

export type ChannelVO = {
  id?: number
  code?: string
  status?: number
  signature?: string
  remark?: string
  apiKey?: string
  apiSecret?: string
  callbackUrl?: string
  createTime?: string
}

export type ListQueryParams = CommonQueryParams & {
  status?: number
  signature?: string
}

export const getChannelList = (params?: ListQueryParams) => {
  return request.get<PaginatedList<ChannelVO>>({
    url: '/system/sms-channel/page',
    params
  })
}

export const getSimpleChannelList = () => {
  return request.get({ url: '/system/sms-channel/simple-list' })
}

export const getChannelDetail = (id: number) => {
  return request.get({ url: `/system/sms-channel/get?id=${id}` })
}

export const addChannel = (data: ChannelVO) => {
  return request.post({
    url: '/system/sms-channel/create',
    data
  })
}

export const updateChannel = (data: ChannelVO) => {
  return request.put({
    url: '/system/sms-channel/update',
    data
  })
}

export const deleteChannel = (id: number) => {
  return request.delete({ url: `/system/sms-channel/get?id=${id}` })
}
