import request from '@/utils/request'

export type ReportVO = {
  id?: string
  name?: string
  code?: string
  sort?: number
  creator?: number
  updater?: number
  createTime?: string | number
  updateTime?: string | number
}

export type ListQueryParams = {
  name?: string
  code?: string
  createTime?: string
  updateTime?: string
} & CommonQueryParams

const url = '/infra/report'

export const getReportList = (params: ListQueryParams) => {
  return request.get<PaginatedList<ReportVO>>({
    url: `${url}/page`,
    params
  })
}

export const deleteReport = (id: string) => {
  return request.delete({
    url: `${url}?id=${id}`
  })
}
