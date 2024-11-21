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

export const getList = (taskDefKey: string) => {
  return request.get({
    url: `/fux-bpm/get-my-task?actId=${taskDefKey}`
  })
}

export const getProcessInstance = async (id: string) => {
  return await request.get({ url: '/fux-bpm/get-process-info?processId=' + id })
}

export const approveTask = async (data) => {
  return await request.put({ url: '/bpm/task/approve', data })
}

export const rejectTask = async (data) => {
  return await request.put({ url: '/bpm/task/reject', data })
}

export const backStartUserTask = async (data: { id: string; reason: string }) => {
  return await request.put({
    url: '/fusionx/framework/return-to-initiator',
    data
  })
}

export const backTask = async (data) => {
  return await request.put({ url: '/bpm/task/return', data })
}

export const backInitiatorTask = async (data) => {
  return await request.put({ url: '/bpm/task/return', data })
}

export const getEchoData = (appId: string, applyId: string) => {
  return request.get<EchoDataVO>({
    url: `/fusionx/framework/data-echo?appId=${appId}&targetId=${applyId}`
  })
}

export const getTaskListByProcessInstanceId = async (processInstanceId?: string) => {
  return await request.get({
    url: '/bpm/task/list-by-process-instance-id?processInstanceId=' + processInstanceId
  })
}

export const getBackOptions = (parentProcessInstanceId?: string) => {
  return request.get({
    url: `/bpm/task/list-by-return?id=${parentProcessInstanceId}`
  })
}

export const getAuditProcessDetail = (processInstanceId: string) => {
  return request.get({
    url: `/fux-bpm/get-process-log?processInstanceId=${processInstanceId}`
  })
}
