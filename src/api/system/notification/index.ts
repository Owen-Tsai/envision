import request from '@/utils/request'

export type NotificationVO = {
  id?: number
  title?: string
  type?: number
  content?: string
  status?: number
  createTime?: number
}

export type ListQueryParams = CommonQueryParams & {
  title?: string
  status?: number
  type?: number
}

const prefix = '/system/notice'

export const getNotificationList = (params?: ListQueryParams) => {
  return request.get<PaginatedList<NotificationVO>>({
    url: `${prefix}/page`,
    params
  })
}

export const getNotificationDetail = (id: number) => {
  return request.get<NotificationVO>({
    url: `${prefix}/get?id=${id}`
  })
}

export const addNotification = (data: NotificationVO) => {
  return request.post({
    url: `${prefix}/create`,
    data
  })
}

export const updateNotification = (data: NotificationVO) => {
  return request.put({
    url: `${prefix}/update`,
    data
  })
}

export const deleteNotification = (id: number) => {
  return request.delete({
    url: `${prefix}/delete?id=${id}`
  })
}
