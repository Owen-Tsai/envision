import request from '@/utils/request'

export type ListQueryParams = CommonQueryParams & {
  taskDefKey?: string
}

export type EchoDataVO = {
  schema: string
  data: Record<string, any>
  plan: object
}

export type AuditProcessDetailsListType = Array<{
  title: string
  subTitle: string
  description: string
  status: string
}>

export const getList = (taskDefKey: string, appId: string) => {
  let url = ''
  if (taskDefKey == 'All') {
    url = `/admin-api/com-apply/get-apply-info-repertory?appId=${appId}`
  } else {
    url += `/admin-api/fux-bpm/get-my-task?actId=${taskDefKey}`
  }
  return request.get({
    url: url
  })
}

export const getProcessInstance = async (id: string) => {
  return await request.get({ url: '/admin-api/fux-bpm/get-process-info?processId=' + id })
}

export type TaskVO = {
  id: string
  reason: string
  fields: object
  targetTaskDefinitionKey?: string
}

export const approveTask = async (data: TaskVO) => {
  return await request.put({ url: '/admin-api/bpm/task/approve', data })
}

export const rejectTask = async (data: TaskVO) => {
  return await request.put({ url: '/admin-api/bpm/task/reject', data })
}

export const backStartUserTask = async (data: TaskVO) => {
  return await request.put({
    url: '/admin-api/fusionx/framework/return-to-initiator',
    data
  })
}

export const backTask = async (data) => {
  return await request.put({ url: '/admin-api/bpm/task/return', data })
}

export const getEchoData = (appId: string, applyId: string) => {
  return request.get<EchoDataVO>({
    url: `/admin-api/fusionx/framework/data-echo?appId=${appId}&targetId=${applyId}`
  })
}

export const getBackOptions = (parentProcessInstanceId?: string) => {
  return request.get({
    url: `/admin-api/bpm/task/list-by-return?id=${parentProcessInstanceId}`
  })
}

export const getAuditProcessDetail = (processInstanceId: string) => {
  return request.get({
    url: `/admin-api/fux-bpm/get-process-log?processInstanceId=${processInstanceId}`
  })
}
