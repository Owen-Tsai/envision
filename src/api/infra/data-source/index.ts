import request from '@/utils/request'

export type DataSourceVO = {
  id?: number
  name?: string
  url?: string
  username?: string
  password?: string
  createTime?: Date
}

export const getDataSourceList = () => {
  return request.get<DataSourceVO[]>({
    url: '/infra/data-source-config/list'
  })
}

export const addDataSource = (data: DataSourceVO) => {
  return request.post({
    url: '/infra/data-source-config/create',
    data
  })
}

export const getDataSourceDetail = (id: number) => {
  return request.get<DataSourceVO>({
    url: `/infra/data-source-config/get?id=${id}`
  })
}

export const updateDataSource = (data: DataSourceVO) => {
  return request.put({
    url: '/infra/data-source-config/create',
    data
  })
}

export const deleteDataSourceDetail = (id: number) => {
  return request.delete({
    url: `/infra/data-source-config/get?id=${id}`
  })
}
