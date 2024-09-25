import request from '@/utils/request'

export type PlanVO = {
  id?: string
  item?: string
  description?: string
  startTime?: string
  endTime?: string
  daily?: boolean
  appId?: string
}

export type ListQueryParams = {
  item?: string
  appId?: string
  startTime?: string
  endTime?: string
  daily?: boolean
} & CommonQueryParams

const url = '/system/apply-plan'

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
    url: `${url}/delete/${id}`
  })
}

export const getPlanDetail = (id: string) => {
  return request.get<PlanVO>({
    url: `${url}/get/${id}`
  })
}
