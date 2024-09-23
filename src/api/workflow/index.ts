import request from '@/utils/request'
import type { Schema } from '@/types/workflow'

export type AppDesignSchemaVO = {
  id?: string
  name?: string
  conf?: string // left empty for now
  schema?: string
  remark?: string
}

const url = `/workflow/form-schema`

export const getAppDesignSchema = (id: string) => {
  return request.get<AppDesignSchemaVO>({
    url: `${url}/get?id=${id}`
  })
}

export const updateAppDesignSchema = (data: AppDesignSchemaVO) => {
  return request.put<AppDesignSchemaVO>({
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
  return request.post<AppDesignSchemaVO>({
    url: `${url}/create`,
    data,
    headers: {
      'Content-Type': 'application/octet-stream'
    }
  })
}
