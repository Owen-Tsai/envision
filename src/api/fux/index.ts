import request from '@/utils/request'
import type { ConfigVO } from '@/api/infra/code-gen'
import type { FlowSchema } from '@/types/fux-core/flow'

export type AppSchemaVO = {
  id?: string
  appId?: string // application ID
  name?: string
  conf?: string // left empty for now
  appSchema?: string
  remark?: string
  version?: string
  versionName?: string
}

export type XMLGenerateVO = {
  id: string
  name: string
  data: FlowSchema['nodes']
}

export type XMLRespVO = {
  data: string
}

export type XMLUpdateVO = {
  id: string // process id
  name: string // app name
  category: string // app type
  bpmnXml: string // generated xml
}

const prefix = `/admin-api/workflow/app-schema`

export const getTableDefList = () => {
  return request.get<ConfigVO[]>({
    url: '/admin-api/infra/codegen/table/list-all',
  })
}

export const createAppSchema = (data: AppSchemaVO) => {
  return request.post({
    url: `${prefix}/create`,
    data,
  })
}

export const updateAppSchema = (data: AppSchemaVO) => {
  return request.put({
    url: `${prefix}/update`,
    data,
  })
}

export const deleteAppSchema = (id: string) => {
  return request.delete({
    url: `${prefix}/delete?id=${id}`,
  })
}

export const getAppDesignSchema = (id: string) => {
  return request.get<AppSchemaVO>({
    url: `${prefix}/get?id=${id}`,
  })
}

export const getAppSchemaByAppId = (appId: string) => {
  return request.get<AppSchemaVO>({
    url: `${prefix}/get-by-app-id?appId=${appId}`,
  })
}

export const addMenuById = (id: string, map: Array<{ uid: string; name: string }>) => {
  return request.post({
    url: `${prefix}/add-menu-by-id`,
    data: { id, map },
  })
}

export const updateMenuById = (id: string, map: Array<{ uid: string; name: string }>) => {
  return request.post({
    url: `${prefix}/update-menu-by-id`,
    data: { id, map },
  })
}

export const getProcessXML = (data: XMLGenerateVO) => {
  return request.post<XMLRespVO>({
    url: '/admin-api/fusionx/framework/xml-by-json',
    data,
  })
}

export const updateProcessXML = (data: XMLUpdateVO) => {
  return request.put({
    url: '/admin-api/bpm/model/update',
    data,
  })
}
