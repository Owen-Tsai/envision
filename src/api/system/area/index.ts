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

export type AreaVO = {
  name?: string
  code?: string
  id?: string
  sort?: number
  pid?: string
  pname?: string
}

export type AreaInfoRespVO = AreaVO & {
  pname: string
}

const prefix = '/admin-api/system/area'

// 获取行政区划树（全部）
export const getAreaTree = () => {
  return request.get<AreaTreeVO>({
    url: `${prefix}/tree-list-all`,
  })
}

// 获取某个行政区划的信息
export const getAreaInfo = (id: string) => {
  return request.get({
    url: `${prefix}/get`,
    params: { id },
  })
}

export const addArea = (data: AreaVO) => {
  return request.post<string>({
    url: `${prefix}/create`,
    data,
  })
}

export const deleteArea = (id: string) => {
  return request.delete({
    url: `${prefix}/delete`,
    params: { id },
  })
}

export const updateArea = (data: AreaVO) => {
  return request.put({
    url: `${prefix}/update`,
    data,
  })
}
