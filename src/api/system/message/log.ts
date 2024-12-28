import request from '@/utils/request'

export type LogVO = {
  createTime?: number
  id?: number
  readStatus?: boolean
  readTime?: number
  templateCode?: string
  templateContent?: string
  templateId?: number
  templateNickname?: string
  templateParams?: Record<string, string | null | number>
  templateType?: number
  userId?: number
  userType?: number
}

export type ListQueryParams = CommonQueryParams & {
  userId?: string
  userType?: number
  templateCode?: string
  templateType?: number
}

export const getList = (params?: ListQueryParams) => {
  return request.get<PaginatedList<LogVO>>({
    url: '/admin-api/system/notify-template/page',
    params,
  })
}
