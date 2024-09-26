import request from '@/utils/request'

export type ListQueryParams = CommonQueryParams & {
  userTaskId?: string
}

export type EchoDataVO = {
  schema: string
  data: Record<string, any>
}

export const getList = (taskDefKey: string) => {
  return request.get({
    url: `/fux-bpm/get-task-by-task-def-key?taskDefKey=${taskDefKey}`
  })
}

export const getProcessInstance = async (id: string) => {
  return await request.get({ url: '/bpm/process-instance/get?id=' + id })
}

export const approveTask = async (data) => {
  return await request.put({ url: '/bpm/task/approve', data })
}

export const rejectTask = async (data) => {
  return await request.put({ url: '/bpm/task/reject', data })
}

export const backTask = async (data) => {
  return await request.put({ url: '/bpm/task/return', data })
}

export const getEchoData = (appId: string, applyId: string) => {
  return request.get<EchoDataVO>({
    url: `/fusionx/framework/data-echo?appId=${appId}&applyId=${applyId}`
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
