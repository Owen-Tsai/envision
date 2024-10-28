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

const prefix = `/workflow/app-schema`

export const getTableDefList = () => {
  return request.get<ConfigVO[]>({
    url: '/infra/codegen/table/list-all'
  })
}

export const createAppSchema = (data: AppSchemaVO) => {
  return request.post({
    url: `${prefix}/create`,
    data
  })
}

export const updateAppSchema = (data: AppSchemaVO) => {
  return request.put({
    url: `${prefix}/update`,
    data
  })
}

export const deleteAppSchema = (id: string) => {
  return request.delete({
    url: `${prefix}/delete?id=${id}`
  })
}

export const getAppDesignSchema = (id: string) => {
  return request.get<AppSchemaVO>({
    url: `${prefix}/get?id=${id}`
  })
}

export const getAppDesignSchemaByAppId = (appId: string) => {
  return request.get<AppSchemaVO>({
    url: `${prefix}/get-by-app-id?appId=${appId}`
  })
}

export const addMenuById = (id: string, map: Array<{ uid: string; name: string }>) => {
  return request.post({
    url: `${prefix}/add-menu-by-id`,
    data: { id, map }
  })
}

export const updateMenuById = (id: string, map: Array<{ uid: string; name: string }>) => {
  return request.post({
    url: `${prefix}/update-menu-by-id`,
    data: { id, map }
  })
}

export const getProcessXML = (data: XMLGenerateVO) => {
  return request.post<XMLRespVO>({
    url: '/fusionx/framework/xml-by-json',
    data
  })
}

export const updateProcessXML = (data: XMLUpdateVO) => {
  return request.put({
    url: '/bpm/model/update',
    data
  })
}
