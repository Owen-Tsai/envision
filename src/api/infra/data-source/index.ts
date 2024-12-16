import request from '@/utils/request'

export type DataSourceVO = {
  id?: number
  name?: string
  url?: string
  username?: string
  password?: string
  createTime?: Date
}

const url = '/admin-api/infra/data-source-config'

export const getDataSourceList = () => {
  return request.get<DataSourceVO[]>({
    url: `${url}/list`,
  })
}

export const addDataSource = (data: DataSourceVO) => {
  return request.post({
    url: `${url}/create`,
    data,
  })
}

export const getDataSourceDetail = (id: number) => {
  return request.get<DataSourceVO>({
    url: `${url}/get?id=${id}`,
  })
}

export const updateDataSource = (data: DataSourceVO) => {
  return request.put({
    url: `${url}/create`,
    data,
  })
}

export const deleteDataSourceDetail = (id: number) => {
  return request.delete({
    url: `${url}/get?id=${id}`,
  })
}
