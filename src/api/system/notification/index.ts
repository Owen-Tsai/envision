import request from '@/utils/request'

export type NotificationVO = {
  id?: number
  title?: string
  type?: number
  content: string
  status?: number
  createTime?: number
}

export type NotificationListVO = {
  list: NotificationVO[]
  total: number
}

export type ListQueryParams = CommonQueryParams & {
  title?: string
  status?: number
  type?: number
}

export const getNotificationList = (params: ListQueryParams) => {
  return request.get<NotificationListVO>({
    url: '/system/notice/page',
    params
  })
}

export const getNotificationDetail = (id: number) => {
  return request.get<NotificationVO>({
    url: `/system/notice/get?id=${id}`
  })
}

export const addNotification = (data: NotificationVO) => {
  return request.post({
    url: '/system/notice/create',
    data
  })
}

export const updateNotification = (data: NotificationVO) => {
  return request.put({
    url: '/system/notice/update',
    data
  })
}

export const deleteNotification = (id: number) => {
  return request.delete({
    url: `/system/notice/delete?id=${id}`
  })
}
