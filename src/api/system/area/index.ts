import request from '@/utils/request'

export type AreaTreeNode = {
  id: string
  key: string
  name: string
  code: string
  pid: string
  sort: number
  children?: AreaTreeNode[]
}

export type AreaTreeVO = AreaTreeNode[]

export type AddAreaVO = {
  name: string
  code: string
  pid: string
}

const prefix = '/system/area/'

export const getAreaTree = () => {
  return request.get<AreaTreeVO>({
    url: `${prefix}/area-list_all_by_pid`,
    params: {}
  })
}

export const getAreaInfo = (id: string) => {
  return request.get({
    url: `${prefix}/get`,
    params: {
      id: id
    }
  })
}

export const addAreaInfo = (data: AddAreaVO) => {
  return request.post({
    url: `${prefix}/create`,
    data
  })
}

export const deleteAreaInfo = (id: string) => {
  return request.delete({
    url: `${prefix}/delete`,
    params: {
      id
    }
  })
}

export const modifyAreaInfo = (id: string, name: string) => {
  return request.put({
    url: `${prefix}/update`,
    data: {
      id,
      name
    }
  })
}
