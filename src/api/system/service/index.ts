export type ServiceVO = {
  id?: number
  name?: string
  createTime?: string
  updateTime?: string
  status?: number
}

export type QueryParams = {
  name?: string
  status?: number
  createTime?: string
  updateTime?: string
} & CommonQueryParams
