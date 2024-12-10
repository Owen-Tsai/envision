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
  createTime?: number
}

export type ListQueryParams = CommonQueryParams & {
  status?: number
  signature?: string
}

const prefix = '/admin-api/system/sms-channel'

export type ChannelListLiteVO = Array<Pick<ChannelVO, 'id' | 'code' | 'signature'>>

export const getChannelList = (params?: ListQueryParams) => {
  return request.get<PaginatedList<ChannelVO>>({
    url: `${prefix}/page`,
    params
  })
}

export const getSimpleChannelList = () => {
  return request.get<ChannelListLiteVO>({ url: `${prefix}/list-all-simple` })
}

export const getChannelDetail = (id: number) => {
  return request.get({ url: `${prefix}/get?id=${id}` })
}

export const addChannel = (data: ChannelVO) => {
  return request.post({
    url: `${prefix}/create`,
    data
  })
}

export const updateChannel = (data: ChannelVO) => {
  return request.put({
    url: `${prefix}/update`,
    data
  })
}

export const deleteChannel = (id: number) => {
  return request.delete({ url: `${prefix}/get?id=${id}` })
}
