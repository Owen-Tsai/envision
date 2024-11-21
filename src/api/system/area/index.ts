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

export const getAreaTree = () => {
  return request.get<AreaTreeVO>({
    url: '/system/area/area-list_all_by_pid',
    params: {}
  })
}

export const getAreaInfo = (id: string) => {
  return request.get({
    url: '/system/area/get',
    params: {
      id: id
    }
  })
}

export const addAreaInfo = (data: AddAreaVO) => {
  return request.post({
    url: '/system/area/create',
    data
  })
}

export const deleteAreaInfo = (id: string) => {
  return request.delete({
    url: '/system/area/delete',
    params: {
      id
    }
  })
}

export const modifyAreaInfo = (id: string, name: string) => {
  return request.put({
    url: '/system/area/update',
    data: {
      id,
      name
    }
  })
}
