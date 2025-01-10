import request from '@/utils/request'
import type { PlanVO } from '@/api/application/plan'

export type ListQueryParams = CommonQueryParams & {
  taskDefKey?: string
}

export type EchoDataVO = {
  schema: string
  data: Record<string, any>
  plan: PlanVO
}

export type AuditProcessDetailsListType = Array<{
  title: string
  subTitle: string
  description: string
  status: string
}>

export const getList = (taskDefKey: string, appId: string) => {
  const url =
    taskDefKey === 'All'
      ? `/admin-api/com-apply/get-apply-info-repertory?appId=${appId}`
      : `/admin-api/fux-bpm/get-my-task?actId=${taskDefKey}`

  return request.get({
    url,
  })
}

export const getProcessInstance = (parentProcessInstanceId: string, taskId: string) => {
  return request.get({
    url:
      '/admin-api/fux-bpm/get-process-info?processId=' +
      parentProcessInstanceId +
      '&taskId=' +
      taskId,
  })
}

export type TaskVO = {
  id: string
  reason: string
  fields: object
  targetTaskDefinitionKey?: string
}

export const approveTask = (data: TaskVO) => {
  return request.put({ url: '/admin-api/bpm/task/approve', data })
}

export const rejectTask = (data: TaskVO) => {
  return request.put({ url: '/admin-api/bpm/task/reject', data })
}

export const returnTaskToStart = (data: TaskVO) => {
  return request.put({
    url: '/admin-api/fusionx/framework/return-to-initiator',
    data,
  })
}

export const returnTask = (data) => {
  return request.put({ url: '/admin-api/bpm/task/return', data })
}

export const getEchoData = (appId: string, applyId: string) => {
  return request.get<EchoDataVO>({
    url: '/admin-api/fusionx/framework/data-echo',
    params: {
      appId,
      targetId: applyId,
    },
  })
}

export const getTaskReturnOptions = (parentProcessInstanceId?: string) => {
  return request.get({
    url: `/admin-api/bpm/task/list-by-return?id=${parentProcessInstanceId}`,
  })
}

export const getAuditProcessDetail = (processInstanceId: string) => {
  return request.get({
    url: `/admin-api/fux-bpm/get-process-log?processInstanceId=${processInstanceId}`,
  })
}
