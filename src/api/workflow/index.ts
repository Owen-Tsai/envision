import request from '@/utils/request'
import type { Schema } from '@/types/workflow'

export type AppDesignSchemaVO = {
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
  data: Schema['flow']['nodes']
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

const url = `/workflow/app-schema`

export const getAppDesignSchema = (id: string) => {
  return request.get<AppDesignSchemaVO>({
    url: `${url}/get?id=${id}`
  })
}

export const getSchemaByAppId = (appId: string) => {
  return request.get<AppDesignSchemaVO>({
    url: `${url}/get-by-app-id?appId=${appId}`
  })
}

export const updateAppDesignSchema = (data: AppDesignSchemaVO) => {
  return request.put<string>({
    url: `${url}/update`,
    data
  })
}

export const deleteAppDesignSchema = (id: string) => {
  return request.delete({
    url: `${url}/delete?id=${id}`
  })
}

export const listAppDesignSchema = () => {
  return request.get<AppDesignSchemaVO[]>({
    url: `${url}/list`
  })
}

export const createAppDesignSchema = (data: AppDesignSchemaVO) => {
  return request.post<string>({
    url: `${url}/create`,
    data
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

export const addMenuById = (id: string, map: Array<{ uid: string; name: string }>) => {
  return request.post({
    url: `${url}/add-menu-by-id`,
    data: { id, map }
  })
}

export const updateMenuById = (id: string, map: Array<{ uid: string; name: string }>) => {
  return request.post({
    url: `${url}/update-menu-by-id`,
    data: { id, map }
  })
}
