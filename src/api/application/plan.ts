import request from '@/utils/request'
import type { Dayjs } from 'dayjs'

export type PlanVO = {
  id?: string
  item?: string
  description?: string
  startTime?: string
  endTime?: string
  daily?: boolean
  appId?: string
  flow?: string
  fjfl?: string[]
  appName?: string
}

export type ListQueryParams = {
  item?: string
  appId?: string
  startTime?: [string, string] | [Dayjs, Dayjs]
  daily?: boolean
} & CommonQueryParams

const url = '/admin-api/system/apply-plan'

export const getPlanList = (params?: ListQueryParams) => {
  return request.get<PaginatedList<PlanVO>>({
    url: `${url}/page`,
    params
  })
}

export const createPlan = (data: PlanVO) => {
  return request.post({
    url: `${url}/create`,
    data
  })
}

export const updatePlan = (data: PlanVO) => {
  return request.put({
    url: `${url}/update`,
    data
  })
}

export const deletePlan = (id: string) => {
  return request.delete({
    url: `${url}/delete?id=${id}`
  })
}

export const getPlanDetail = (id: string) => {
  return request.get<PlanVO>({
    url: `${url}/get?id=${id}`
  })
}

export const getAttachTypeSimpleList = () => {
  return request.get({
    url: `/admin-api/attach/type/get_attach_type_simple_list`
  })
}
